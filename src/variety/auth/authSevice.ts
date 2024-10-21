import { CodStatus, StatusResult } from "../../types/interfaces";
import { jwtAdapter } from "../../adapters/jwtAdapter";
import { passwordHashAdapter } from "../../adapters/passwordHashAdapter";
import { SECRET_KEY } from "../../setting";
import { APIErrorResult} from "../../types/types";
import { authRepository } from "./authRepository"; 
import {v4 as uuidv4} from 'uuid'
import {add, isBefore} from 'date-fns'
import { AboutUser } from "./types";
import { ConfirmEmailModel, UserInputModel, UserPasswordModel, UserUnconfirmedModel } from "../users/types";
import { mailManager } from "../../utility/mailManager";
import { UserDBModel } from "../../db/dbTypes";
import { userRepository } from "../users/repositories/userRepository";
import { userService } from "../users/userSevice";

export const authService = {

    async authorization(loginOrEmail: string, password: string): Promise<StatusResult<string|undefined|APIErrorResult >> {
        
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> = await userRepository.getUserByLoginEmail(loginOrEmail)
        if(foundUser.codResult != CodStatus.Ok) return {codResult: CodStatus.NotAuth};
        
        if(!await passwordHashAdapter.checkHash(password, foundUser.data!.passHash)) 
            return {codResult: CodStatus.NotAuth}
        
        let token = jwtAdapter.createToken(foundUser.data!.id, SECRET_KEY)
        return {codResult: CodStatus.Ok, data: token}
        
    },
    
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
        console.log(`confirmation user ${foundUser.data?.user.email}`)                                          // console.log
        const addingUser: StatusResult<string | undefined> = await userRepository.create(user)
        if(addingUser.codResult == CodStatus.Error)
            return addingUser as StatusResult
        
        const deletingUser: StatusResult = await authRepository.delete(foundUser.data!.id)
        if(deletingUser.codResult == CodStatus.Error)
            return deletingUser

        return {codResult: CodStatus.NoContent}
    },

    async registrationUser(newUser: UserInputModel): Promise<StatusResult<undefined|APIErrorResult>>{

        const isUniq: StatusResult<APIErrorResult|undefined> = await userService.checkUniq(newUser.login, newUser.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const passHash = await passwordHashAdapter.createHash(newUser.password)
        
        const createUser: UserDBModel = {...newUser, password: passHash, createdAt: (new Date()).toISOString()}

        const confirmEmail: ConfirmEmailModel = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: 2}).toISOString(),
            countSendingCode: 1
        }
        
        const createAnswer: StatusResult = await authRepository.createUnconfirmUser({user: createUser, confirmEmail: confirmEmail})
        if(createAnswer.codResult == CodStatus.NoContent)
            mailManager.createConfirmEmail(newUser.email, confirmEmail.code)
        return createAnswer


    },

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
            expirationTime: add(new Date(), { hours: 2}).toISOString(),
            countSendingCode: ++countMail
        }
        
        const updateAnswer: StatusResult = await authRepository.updateCode(mail, confirmEmail)
        if(updateAnswer.codResult == CodStatus.NoContent)
            mailManager.createConfirmEmail(mail, confirmEmail.code)
        return updateAnswer

    },

    async aboutMe(id: string): Promise<StatusResult<AboutUser|undefined>>{
        const foundUser: StatusResult<AboutUser|undefined> = await userRepository.findForOwnerById(id)
        if(foundUser.codResult == CodStatus.Ok)
            return foundUser;
        return {codResult: CodStatus.NotAuth}
    },
    
    async clear(): Promise < StatusResult > {
        return await authRepository.clear()
    },  
}

