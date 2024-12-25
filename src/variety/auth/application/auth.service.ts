import { jwtAdapter } from "../../../adapters/jwt.adapter";
import { passwordHashAdapter } from "../../../adapters/password.hash.adapter";
import { APIErrorResult, CodStatus, StatusResult, tokenPayload } from "../../../types/types";
import {v4 as uuidv4} from 'uuid'
import {add, isBefore, subSeconds} from 'date-fns'
import { AboutUser, AuthorizationType, Tokens } from "../types";
import { ConfirmEmailType, UserInputType, UserPasswordType, UserUnconfirmedType } from "../../users/types";
import { mailManager } from "../../../utility/mail.manager";
import { activeSessionDB, UserDBType } from "../../../db/db.types";
import { UserRepository } from "../../users/repositories/user.repository";
import ShortUniqueId from 'short-unique-id';
import { rateLimiting } from "../../../midlleware/rate.limiting";
import { deviceService } from "../../devices/application/device.service";
import { deviceRepository } from "../../devices/repositories/device.repository";
import { TIME_LIFE_REFRESH_TOKEN } from "../../../setting";

export const authService = {

    //+
    async authorization(user:AuthorizationType): Promise<StatusResult<Tokens|undefined >> {
        
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> 
            = await UserRepository.getUserByLoginEmail(user.loginOrEmail)
        
        if(foundUser.codResult != CodStatus.Ok) 
            return {codResult: CodStatus.NotAuth};
        if(!await passwordHashAdapter.checkHash(user.password, foundUser.data!.passHash)) 
            return {codResult: CodStatus.NotAuth}
        
        const createAnswer = await deviceService.createSession(foundUser.data!.id, user.deviceName, user.ip)
        if (createAnswer.codResult == CodStatus.Error)
            return {codResult: CodStatus.Error}
        
        return this.createTokens(createAnswer.data!)  
    },

    //+
    async rateLimiting(ip: string, url: string, date: Date): Promise<boolean>{
        await authRepository.setRequestAPI(ip, url, date)
        const dateFrom = subSeconds(date, 10)
        const count = await authRepository.getNumberRequestAPI(ip, url, dateFrom)
        return count <= 5 
            ? true
            : false
    },
    
    //+
    createTokens(payload: tokenPayload): StatusResult<Tokens>{

        let accessToken = jwtAdapter.createAccessToken(payload)
        let rfToken = jwtAdapter.createRefrashToken(payload)
        return {codResult: CodStatus.Ok, data: {accessToken: accessToken, refreshToken: rfToken}}
                
    },

    //+
    async confirmationUser(code: string): Promise<StatusResult<APIErrorResult|undefined>>{
        const foundUser: StatusResult<UserUnconfirmedType|undefined> = await authRepository.findByConfirmCode(code)

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
        const addingUser: StatusResult<string | undefined> = await UserRepository.create(user)
        if(addingUser.codResult == CodStatus.Error)
            return addingUser as StatusResult
        
        const deletingUser: StatusResult = await authRepository.delete(foundUser.data!.id)
        if(deletingUser.codResult == CodStatus.Error)
            return deletingUser

        return {codResult: CodStatus.NoContent}
    },

    //+
    async registrationUser(newUser: UserInputType): Promise<StatusResult<undefined|APIErrorResult>>{

        const isUniq: StatusResult<APIErrorResult|undefined> = await userService.checkUniq(newUser.login, newUser.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const passHash = await passwordHashAdapter.createHash(newUser.password)
        
        const createUser: UserDBType = {...newUser, password: passHash, createdAt: new Date()}

        const confirmEmail: ConfirmEmailType = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: 2}),
            countSendingCode: 1
        }
        
        const createAnswer: StatusResult = await authRepository.createUnconfirmUser({user: createUser, confirmEmail: confirmEmail})
        if(createAnswer.codResult == CodStatus.NoContent)
            mailManager.createConfirmEmail(newUser.email, confirmEmail.code)
        return createAnswer


    },

    //+
    async reSendEmail(mail: string): Promise<StatusResult<undefined|APIErrorResult>>{
        let countMail: number = await authRepository.checkNotVerifEmail(mail)

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
        
        const updateAnswer: StatusResult = await authRepository.updateCode(mail, confirmEmail)
        if(updateAnswer.codResult == CodStatus.NoContent)
            mailManager.createConfirmEmail(mail, confirmEmail.code)
        return updateAnswer

    },

    //+
    async aboutMe(id: string): Promise<StatusResult<AboutUser|undefined>>{
        const foundUser: StatusResult<AboutUser|undefined> = await UserRepository.findForOwnerById(id)
        if(foundUser.codResult == CodStatus.Ok)
            return foundUser;
        return {codResult: CodStatus.NotAuth}
    },

    async refreshingTokens(rfToken: string): Promise<StatusResult<Tokens|undefined>> {


        const checkRT = await this.checkRefreshtoken(rfToken)
        if(checkRT.codResult == CodStatus.NotAuth)
            return {codResult: CodStatus.NotAuth}

        const newToken = await deviceService.updateSession(checkRT.data!)


        if(newToken.codResult != CodStatus.Ok)
            return newToken as StatusResult

        return this.createTokens(newToken.data!)    
    },

    //+
    async logOut(rfToken: string): Promise <StatusResult > {
    
        const checkRT = await this.checkRefreshtoken(rfToken)
        if(checkRT.codResult == CodStatus.NotAuth)
            return {codResult: CodStatus.NotAuth}
            
        return await deviceRepository.deleteThis(checkRT.data!)
    },  

    async checkRefreshtoken(rfToken: string): Promise <StatusResult<tokenPayload|undefined> > {
    
        const payload: tokenPayload | null= jwtAdapter.calcPayloadRT(rfToken)
        if(!payload)
                 return {codResult: CodStatus.NotAuth}

        if(!await deviceService.isActive(payload))
            return  {codResult: CodStatus.NotAuth}
            
        return {codResult: CodStatus.Ok, data: payload}
    },  

    async clear(): Promise < StatusResult > {
        return await authRepository.clear()
    },  
}

function clearExpired(userId: string) {
    throw new Error("Function not implemented.");
}

