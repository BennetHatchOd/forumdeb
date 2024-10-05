import { CodStatus, StatusResult } from "../../types/interfaces";
import { jwtService } from "../../modules/jwtService";
import { passwordHashService } from "../../modules/passwordHashService";
import { SECRET_KEY } from "../../setting";
import { APIErrorResult} from "../../types/types";
import { authRepository } from "./authRepository"; 
import { AboutUser } from "./types";

export const authService = {

    async authUser(loginOrEmail: string, password: string): Promise<StatusResult<string|undefined >> {      
        const foundUser: StatusResult<{id:string, passHash:string}|undefined> = await authRepository.getUserByLoginEmail(loginOrEmail)
        if(foundUser.codResult != CodStatus.Ok) return foundUser as StatusResult;
        
        if(!await passwordHashService.checkHash(password, foundUser.data!.passHash)) 
            return {codResult: CodStatus.NotAuth}
        
        let token = jwtService.createToken(foundUser.data!.id, SECRET_KEY)
        return {codResult: CodStatus.Ok, data: token}
        
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
    
    async aboutMe(id: string): Promise<StatusResult<AboutUser|undefined>>{
        const foundUser: StatusResult<AboutUser|undefined> = await authRepository.findById(id)
        if(foundUser.codResult == CodStatus.Ok)
            return foundUser;
        return {codResult: CodStatus.NotAuth}
    }
}
