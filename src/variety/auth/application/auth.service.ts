import { JwtAdapter} from "../../../adapters/jwt.adapter";
import { passwordHashAdapter } from "../../../adapters/password.hash.adapter";
import { APIErrorResult, CodStatus, StatusResult, tokenPayload } from "../../../types/types";
import {v4 as uuidv4} from 'uuid'
import {add, isBefore, subSeconds} from 'date-fns'
import { AboutUser, AuthorizationType, Tokens } from "../types";
import { ConfirmEmailType, UserInputType, UserPasswordType, UserUnconfirmedType } from "../../users/types";
import { MailManager} from "../../../utility/mail.manager";
import { UserRepository } from "../../users/repositories/user.repository";
import ShortUniqueId from 'short-unique-id';
import { rateLimiting } from "../../../midlleware/rate.limiting";
import { COUNT_RATE_LIMITED, TIME_LIFE_REFRESH_TOKEN, TIME_RATE_LIMITED } from "../../../setting";
import { AuthRepository } from "../repositories/auth.repository";
import { DeviceService } from "../../devices/application/device.service";
import { UserService } from "../../users/application/user.service";
import { DeviceRepository } from "../../devices/repositories/device.repository";
import { UserType } from "../../users/domain/user.entity";
import { AuthUserType } from "../domain/auth.entity";

export class AuthService {

    constructor(private userRepository: UserRepository,
                private deviceService: DeviceService, 
                private authRepository: AuthRepository, 
                private jwtAdapter: JwtAdapter,  
                private userService: UserService,  
                private deviceRepository: DeviceRepository,
                private mailManager: MailManager){
    }

    async authorization(user:AuthorizationType): Promise<StatusResult<Tokens|undefined >> {
        
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> 
            = await this.userRepository.getPartUserByLoginEmail(user.loginOrEmail)
        
        if(foundUser.codResult != CodStatus.Ok) 
            return {codResult: CodStatus.NotAuth};
        if(!await passwordHashAdapter.checkHash(user.password, foundUser.data!.passHash)) 
            return {codResult: CodStatus.NotAuth}
        
        const createAnswer = await this.deviceService.createSession(foundUser.data!.id, user.deviceName, user.ip)
        if (createAnswer.codResult == CodStatus.Error)
            return {codResult: CodStatus.Error}
        
        return this.createTokens(createAnswer.data!)  
    }

    async rateLimiting(ip: string, url: string, date: Date): Promise<boolean>{
        await this.authRepository.setRequestAPI(ip, url, date)
        //  record the data of calls to the endpoint

        const dateFrom = subSeconds(date, TIME_RATE_LIMITED)
        const count = await this.authRepository.getNumberRequestAPI(ip, url, dateFrom)
        // count the number of entries in the database
        
        return count <= COUNT_RATE_LIMITED 
            ? true
            : false
    }
    
    createTokens(payload: tokenPayload): StatusResult<Tokens>{

        let accessToken = this.jwtAdapter.createAccessToken(payload)
        let rfToken = this.jwtAdapter.createRefrashToken(payload)
        return {codResult: CodStatus.Ok, data: {accessToken: accessToken, refreshToken: rfToken}}
                
    }

    async confirmationUser(code: string): Promise<StatusResult<APIErrorResult|undefined>>{
        const foundUser: StatusResult<UserUnconfirmedType|undefined> = await this.authRepository.findByConfirmCode(code)

        if (foundUser.codResult == CodStatus.NotFound)
            return {codResult: CodStatus.BadRequest, 
                data:{
                        errorsMessages: [{
                                        message: 'code doesn\'t exist',
                                        field: 'code'}]
                    }
                }
        if(isBefore(foundUser.data!.confirmEmail.expirationTime, new Date()))
            return {codResult: CodStatus.BadRequest, 
                    data:{
                            errorsMessages: [{
                                            message: 'code has expired',
                                            field: 'code'}]
                        }
                    }

        const {user} = foundUser.data!
        await this.userRepository.create(user)
        
        const deletingUser: StatusResult = await this.authRepository.delete(foundUser.data!.id)

        return {codResult: CodStatus.NoContent}
    }

    async registrationUser(newUser: UserInputType): Promise<StatusResult<undefined|APIErrorResult>>{

        const isUniq: StatusResult<APIErrorResult|undefined> = await this.userService.checkUniq(newUser.login, newUser.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const passHash = await passwordHashAdapter.createHash(newUser.password)
        
        const createUser: UserType = {...newUser, password: passHash, createdAt: new Date()}

        const confirmEmail: ConfirmEmailType = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: 2}),
            countSendingCode: 1
        }
        
        const createAnswer: StatusResult = await this.authRepository.createUnconfirmUser({user: createUser, confirmEmail: confirmEmail})
        if(createAnswer.codResult == CodStatus.NoContent)
            this.mailManager.createConfirmEmail(newUser.email, confirmEmail.code)
        return createAnswer


    }

    async reSendEmail(mail: string): Promise<StatusResult<undefined|APIErrorResult>>{
        let countMail: number = await this.authRepository.checkNotVerifEmail(mail)

        if(countMail == -1)
            return {codResult: CodStatus.BadRequest, data:{
                "errorsMessages": [{
                    "message": "string",
                    "field": "email"}]
                }}
        
        const confirmEmail: ConfirmEmailType = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: 2}),
            countSendingCode: ++countMail
        }
        
        const updateAnswer: StatusResult = await this.authRepository.updateCode(mail, confirmEmail)
        if(updateAnswer.codResult == CodStatus.NoContent)
            this.mailManager.createConfirmEmail(mail, confirmEmail.code)
        return updateAnswer

    }

    async aboutMe(id: string): Promise<StatusResult<AboutUser|undefined>>{
        const foundUser: StatusResult<AboutUser|undefined> = await this.userRepository.findForOwnerById(id)
        if(foundUser.codResult == CodStatus.Ok)
            return foundUser;
        return {codResult: CodStatus.NotAuth}
    }

    async refreshingTokens(payload: tokenPayload): Promise<StatusResult<Tokens|undefined>> {

        const newToken = await this.deviceService.updateSession(payload)

        if(newToken.codResult != CodStatus.Ok)
            return newToken as StatusResult

        return this.createTokens(newToken.data!)    
    }

    async logOut(payload: tokenPayload): Promise <StatusResult > {
             
        const answer = await this.deviceRepository.deleteThis(payload)
        if (answer.codResult == CodStatus.NoContent)
            return answer

        throw "error of deleting sessions"
    }  

    async checkRefreshtoken(rfToken: string): Promise <StatusResult<tokenPayload|undefined> > {
    
        const payload: tokenPayload | null= this.jwtAdapter.calcPayloadRT(rfToken)
        if(!payload)
                 return {codResult: CodStatus.NotAuth}

        if(!await this.deviceService.isActive(payload))
            return  {codResult: CodStatus.NotAuth}
            
        return {codResult: CodStatus.Ok, data: payload}
    }  

    async clear(): Promise < StatusResult > {
        return await this.authRepository.clear()
    }  
}


