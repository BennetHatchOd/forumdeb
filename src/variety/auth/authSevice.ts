import { CodStatus, StatusResult, tokenPayload } from "../../types/interfaces";
import { jwtAdapter } from "../../adapters/jwtAdapter";
import { passwordHashAdapter } from "../../adapters/passwordHashAdapter";
import { APIErrorResult} from "../../types/types";
import { authRepository } from "./authRepository"; 
import {v4 as uuidv4} from 'uuid'
import {add, isBefore, subSeconds} from 'date-fns'
import { AboutUser, AuthorizationModel, Tokens } from "./types";
import { ConfirmEmailModel, UserInputModel, UserPasswordModel, UserUnconfirmedModel } from "../users/types";
import { mailManager } from "../../utility/mailManager";
import { activeSessionDB, UserDBModel } from "../../db/dbTypes";
import { userRepository } from "../users/repositories/userRepository";
import { userService } from "../users/userSevice";
import ShortUniqueId from 'short-unique-id';
import { rateLimiting } from "../../midlleware/rateLimiting";
import { deviceService } from "../devices/deviceService";
import { deviceRepository } from "../devices/repositories/deviceRepository";
import { TIME_LIFE_REFRESH_TOKEN } from "../../setting";

export const authService = {

    //+
    async authorization(user:AuthorizationModel): Promise<StatusResult<Tokens|undefined >> {
        
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> 
            = await userRepository.getUserByLoginEmail(user.loginOrEmail)
        
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
    createTokens(session: activeSessionDB): StatusResult<Tokens>{

        let accessToken = jwtAdapter.createAccessToken(session)
        let rfToken = jwtAdapter.createRefrashToken(session)
        return {codResult: CodStatus.Ok, data: {accessToken: accessToken, refreshToken: rfToken}}
                
    },

    //+
    async confirmationUser(code: string): Promise<StatusResult<APIErrorResult|undefined>>{
        const foundUser: StatusResult<UserUnconfirmedModel|undefined> = await authRepository.findByConfirmCode(code)

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
        const addingUser: StatusResult<string | undefined> = await userRepository.create(user)
        if(addingUser.codResult == CodStatus.Error)
            return addingUser as StatusResult
        
        const deletingUser: StatusResult = await authRepository.delete(foundUser.data!.id)
        if(deletingUser.codResult == CodStatus.Error)
            return deletingUser

        return {codResult: CodStatus.NoContent}
    },

    //+
    async registrationUser(newUser: UserInputModel): Promise<StatusResult<undefined|APIErrorResult>>{

        const isUniq: StatusResult<APIErrorResult|undefined> = await userService.checkUniq(newUser.login, newUser.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const passHash = await passwordHashAdapter.createHash(newUser.password)
        
        const createUser: UserDBModel = {...newUser, password: passHash, createdAt: new Date()}

        const confirmEmail: ConfirmEmailModel = {
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
        
        const confirmEmail: ConfirmEmailModel = {
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
        const foundUser: StatusResult<AboutUser|undefined> = await userRepository.findForOwnerById(id)
        if(foundUser.codResult == CodStatus.Ok)
            return foundUser;
        return {codResult: CodStatus.NotAuth}
    },

    async refreshingTokens(rfToken: string): Promise<StatusResult<Tokens|undefined>> {


        const checkRT = await this.checkRefreshtoken(rfToken)
        if(checkRT.codResult == CodStatus.NotAuth)
            return {codResult: CodStatus.NotAuth}

        const uid = new ShortUniqueId({ length: 5 });
        const updateSession: activeSessionDB = {userId: checkRT.data!.userId,
                                    deviceId: checkRT.data!.deviceId,
                                    version:    uid.rnd(),
                                    deviceName: '',
                                    ip:         '',
                                    createdAt:  new Date(),
                                    expiresAt:  add(new Date, {seconds: TIME_LIFE_REFRESH_TOKEN})
        }

        if((await deviceRepository.update(updateSession)).codResult != CodStatus.Ok)
            return {codResult: CodStatus.NotAuth}

        return this.createTokens(updateSession)
       
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

        if(!await deviceRepository.isActive(payload))
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

