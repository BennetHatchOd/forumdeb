import { CodStatus, StatusResult } from "../../types/interfaces";
import { passwordHashAdapter } from "../../adapters/passwordHashAdapter";
import { APIErrorResult, FieldError} from "../../types/types";
import { userRepository } from "./repositories/userRepository"; 
import bcrypt from "bcrypt"
import { UserInputModel, UserPasswordModel } from "./types";
import { authRepository } from "../auth/authRepository";

export const userService = {

 
    async create(createItem: UserInputModel): Promise<StatusResult<string|APIErrorResult|undefined>>{      
        const isUniq: StatusResult<APIErrorResult|undefined> = await this.checkUniq(createItem.login, createItem.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq;
        
        const hash: string = await passwordHashAdapter.createHash(createItem.password)
        const newUser: Omit<UserPasswordModel, 'id'> = {
                                login: createItem.login,
                                email: createItem.email,
                                password: hash, 
                                createdAt: new Date().toISOString(),
                            }
        return await userRepository.create(newUser)

    },
    
    async checkUniq(login: string, email: string): Promise<StatusResult<APIErrorResult| undefined>> { 
        
        const userResult = await userRepository.checkUniq(login, email)
        const authResult = await authRepository.checkUniq(login, email)
        
        if (userResult.data || authResult.data){
            const checkResult = userResult.data
                            ? userResult.data
                            : authResult.data
            let errorsMessages: Array<FieldError> = checkResult!.map(s => {
                return {
                    message: `${s} should be unique`,
                    field: s}
                })
            return{  
                codResult: CodStatus.BadRequest,
                data: {
                    errorsMessages: errorsMessages} 
                }    
            }
            return {codResult: CodStatus.Ok}
        },
    
    async delete(id: string): Promise<StatusResult> {     
        let isExistUser = await userRepository.isExist(id);
        if (isExistUser.codResult == CodStatus.Ok)
            return await userRepository.delete(id);
        isExistUser = await authRepository.isExist(id);
        if (isExistUser.codResult == CodStatus.Ok)
            return await authRepository.delete(id);
        return {codResult : CodStatus.NotFound}
        
    },
    
    async clear(): Promise < StatusResult > {
        return await userRepository.clear()
    },  
    
    }
