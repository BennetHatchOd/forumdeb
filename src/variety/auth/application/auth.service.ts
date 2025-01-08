import { JwtAdapter} from "../../../adapters/jwt.adapter";
import { PasswordHashAdapter} from "../../../adapters/password.hash.adapter";
import { APIErrorResult, CodStatus, StatusResult, tokenPayload } from "../../../types/types";
import {v4 as uuidv4} from 'uuid'
import {add, isBefore, subSeconds} from 'date-fns'
import { AboutUser, AuthorizationType, Tokens } from "../types";
import { ConfirmEmailType, UserInputType, UserPasswordType, UserUnconfirmedType } from "../../users/types";
import { MailManager} from "../../../utility/mail.manager";
import { UserRepository } from "../../users/repositories/user.repository";
import { COUNT_RATE_LIMITED, TIME_LIFE_EMAIL_CODE, TIME_LIFE_PASSWORD_CODE, TIME_LIFE_REFRESH_TOKEN, TIME_RATE_LIMITED } from "../../../setting/setting";
import { AuthRepository } from "../repositories/auth.repository";
import { DeviceService } from "../../devices/application/device.service";
import { UserService } from "../../users/application/user.service";
import { DeviceRepository } from "../../devices/repositories/device.repository";
import { UserType } from "../../users/domain/user.entity";
import { newPasswordType } from "../domain/newPassword.entity";

export class AuthService {

    constructor(private userRepository: UserRepository,
                private deviceService: DeviceService, 
                private authRepository: AuthRepository, 
                private jwtAdapter: JwtAdapter,  
                private userService: UserService,  
                private deviceRepository: DeviceRepository,
                private mailManager: MailManager,
                private passwordHashAdapter: PasswordHashAdapter){
    }

    async authorization(user:AuthorizationType): Promise<StatusResult<Tokens|undefined >> {
        
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> 
            = await this.userRepository.getPartUserByLoginEmail(user.loginOrEmail)
        
        if(foundUser.codResult != CodStatus.Ok) 
            return {codResult: CodStatus.NotAuth};
        if(!await this.passwordHashAdapter.checkHash(user.password, foundUser.data!.passHash)) 
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
    
    async registrationUser(newUser: UserInputType): Promise<StatusResult<undefined|APIErrorResult>>{

        const isUniq: StatusResult<APIErrorResult|undefined> = await this.userService.checkUniq(newUser.login, newUser.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const passHash = await this.passwordHashAdapter.createHash(newUser.password)
        
        const createUser: UserType = {...newUser, password: passHash, createdAt: new Date()}

        const confirmEmail: ConfirmEmailType = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: TIME_LIFE_EMAIL_CODE}),
            countSendingCode: 1
        }
        
        const createAnswer: StatusResult = await this.authRepository.createUnconfirmUser({user: createUser, confirmEmail: confirmEmail})
        if(createAnswer.codResult == CodStatus.NoContent)
            this.mailManager.createConfirmEmail(newUser.email, confirmEmail.code)
        return createAnswer


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
            expirationTime: add(new Date(), { hours: TIME_LIFE_EMAIL_CODE}),
            countSendingCode: ++countMail
        }
        
        const updateAnswer: StatusResult = await this.authRepository.updateEmailCode(mail, confirmEmail)
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

    async askNewPassword(mail: string): Promise<StatusResult>{

        let existEmail: StatusResult<string|undefined> = await this.userRepository.findIdByEmail(mail)
        if(existEmail.codResult == CodStatus.NotFound)
            return {codResult: CodStatus.NoContent}
        

        const passwordCode: newPasswordType = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: TIME_LIFE_PASSWORD_CODE}),
            userId: existEmail.data!
        }
        
        await this.authRepository.createPasswordCode(passwordCode)
        await this.mailManager.createPasswordRecovery(mail, passwordCode.code)

        return {codResult: CodStatus.NoContent}
    }

    async setNewPassword(newPassword: string, recoveryCode: string): Promise<StatusResult>{

        const user: StatusResult<{userId: string, expirationTime: Date}|undefined> 
              = await this.authRepository.findPasswordRecovery(recoveryCode)        
        
        if(user.codResult == CodStatus.NotFound)
            return {codResult: CodStatus.BadRequest}

        this.authRepository.deletePasswordRecovery(user.data!.userId)

        if(isBefore(user.data!.expirationTime, new Date())){
            return  {codResult: CodStatus.BadRequest}
        }
        const hash: string = await this.passwordHashAdapter.createHash(newPassword)
        await this.userRepository.editPassword(user.data!.userId, hash)
        return {codResult: CodStatus.NoContent}
    }

    async clear(): Promise < StatusResult > {
        return await this.authRepository.clear()
    }  
}


