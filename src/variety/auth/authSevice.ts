import { CodStatus, StatusResult } from "../../interfaces";
import { cryptoHash } from "../../modules/cryptoHash";
import { APIErrorResult} from "../../types";
import { authRepository } from "./authRepository"; 

export const authService = {

    async authUser(loginOrEmail: string, password: string): Promise<StatusResult> {      
        const foundUser: StatusResult<string|undefined> = await authRepository.getPasswordByLoginEmail(loginOrEmail)
        if(foundUser.codResult != CodStatus.Ok) return foundUser as StatusResult;
        
        return await cryptoHash.checkHash(password, foundUser.data as string)
        ? {codResult: CodStatus.Ok}
        : {codResult: CodStatus.NotAuth}
    },
    
    isValid(loginOrEmail: string, password: string): StatusResult<APIErrorResult|undefined> {          
        const answerError: APIErrorResult = {
            errorsMessages: []
        }
        const loginTemplate = /^[a-zA-Z0-9_-]*$/
        const emailTemplate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 
        
        if(!emailTemplate.test(loginOrEmail) && 
        !(loginTemplate.test(loginOrEmail) && loginOrEmail.length > 2 && loginOrEmail.length < 11))
        answerError.errorsMessages.push({message: 'Login or email has incorrect values', field: 'loginOrEmail'})
        
        if(password.length < 6 || password.length > 20)
            answerError.errorsMessages.push({message: 'password has incorrect values', field: 'password'})
        
        if(answerError.errorsMessages.length == 0)
            return {codResult: CodStatus.Ok};
        
        return {codResult: CodStatus.BadRequest, data: answerError};
    },
    
    }
