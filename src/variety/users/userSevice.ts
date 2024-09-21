import { CodStatus, StatusResult } from "../../interfaces";
import { catchErr } from "../../modules/catchErr";
import { cryptoHash } from "../../modules/cryptoHash";
import { UserInputModel, APIErrorResult, FieldError, UserInnerModel} from "../../types";
import { userRepository } from "./repositories/userRepository"; 
import bcrypt from "bcrypt"

export const userService = {

 
    async create(createItem: UserInputModel): Promise<StatusResult<string|null>>{      
        try{            
            const hash: string = await cryptoHash.createHash(createItem.password)
            const newUser: UserInnerModel = {
                                    login: createItem.login,
                                    email: createItem.email,
                                    password: hash, 
                                    id: '',
                                    createdAt: new Date().toISOString(),
                                }
            return await userRepository.create(newUser)
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async authUser(loginOrEmail: string, password: string): Promise<StatusResult> {      
        try{
            const foundUser: StatusResult<string|null> = await userRepository.getPasswordByLoginEmail(loginOrEmail)
            if(foundUser.codResult != CodStatus.Ok) return foundUser as StatusResult;
            
            return await cryptoHash.checkHash(password, foundUser.data as string)
            ? {codResult: CodStatus.Ok}
            : {codResult: CodStatus.NotAuth}
        } 
        catch (err){
            return catchErr(err);
        }
    },

    isValid(loginOrEmail: string, password: string): boolean|APIErrorResult {          
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
            return true;
        
        return answerError;
    },

    async checkUniq(login: string, email: string): Promise<StatusResult<APIErrorResult| null>> { 

        try{            
            const checkResult = await userRepository.checkUniq(login, email)
            
            if (checkResult.data){
                let errorsMessages: Array<FieldError> = checkResult.data.map(s => {
                                                                            return {
                                                                                message: `${s} should be unique`,
                                                                                field: s}
                                                                            })
                return{  
                    codResult: CodStatus.BadRequest,
                    data: {
                        errorsMessages: errorsMessages
                    } 
                }    
            }
            return checkResult as StatusResult
        } 
        catch (err){
            return catchErr(err);
        }
    },
 
   async delete(id: string): Promise<StatusResult> {     
        try{
            const isExistUser = await userRepository.isExist(id);
            if (isExistUser.codResult != CodStatus.Ok)
                return isExistUser;    

            return await userRepository.delete(id);
        } 
        catch (err){
            return catchErr(err);
        }
    },
    
    async clear(): Promise < StatusResult > {
        try{    
            return await userRepository.clear()
        } 
        catch (err){
            return catchErr(err);
        }
    },

    
 
}
