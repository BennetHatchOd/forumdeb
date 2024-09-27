import { CodStatus, StatusResult } from "../../interfaces";
import { cryptoHash } from "../../modules/cryptoHash";
import { UserInputModel, APIErrorResult, FieldError, UserPasswordModel} from "../../types";
import { userRepository } from "./repositories/userRepository"; 
import bcrypt from "bcrypt"

export const userService = {

 
    async create(createItem: UserInputModel): Promise<StatusResult<string|APIErrorResult|undefined>>{      
            
        const isUniq: StatusResult<APIErrorResult|undefined> = await this.checkUniq(createItem.login, createItem.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const hash: string = await cryptoHash.createHash(createItem.password)
        const newUser: Omit<UserPasswordModel, 'id'> = {
                                login: createItem.login,
                                email: createItem.email,
                                password: hash, 
                                createdAt: new Date().toISOString(),
                            }
        return await userRepository.create(newUser)

    },
    
    async checkUniq(login: string, email: string): Promise<StatusResult<APIErrorResult| undefined>> { 
        
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
        },
        
    async delete(id: string): Promise<StatusResult> {     
        const isExistUser = await userRepository.isExist(id);
        if (isExistUser.codResult != CodStatus.Ok)
            return isExistUser;    
        
        return await userRepository.delete(id);
        
    },
    
    async clear(): Promise < StatusResult > {
        return await userRepository.clear()
    },  
    
    }
