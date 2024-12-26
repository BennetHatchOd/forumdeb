//import { CodStatus, StatusResult } from "../../../types/interfaces";
import { passwordHashAdapter } from "../../../adapters/password.hash.adapter";
import { APIErrorResult, CodStatus, FieldError, StatusResult} from "../../../types/types";
import { UserRepository } from "../repositories/user.repository"; 
import { UserInputType } from "../types";
import { UserModel, UserType } from "../domain/user.entity";
import { AuthRepository } from "../../auth/repositories/auth.repository";

export class UserService {
   
    constructor(private userRepository: UserRepository,
                private authRepository: AuthRepository){ 
    }

    async create(createItem: UserInputType): Promise<StatusResult<string|APIErrorResult>>{     
        //  returns CodResult with: id-string of the created object, 
        //  or an array of errors, if the login or email is duplicated

        const isUniq: StatusResult<APIErrorResult|undefined> = await this.checkUniq(createItem.login, createItem.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq as StatusResult<APIErrorResult>;
        
        const hash: string = await passwordHashAdapter.createHash(createItem.password)
        const newUser: UserType = {
                                login: createItem.login,
                                email: createItem.email,
                                password: hash, 
                                createdAt: new Date(),
                            }
        return await this.userRepository.create(newUser) as StatusResult<string>
 
    }
    
    async checkUniq(login: string, email: string): Promise<StatusResult<APIErrorResult| undefined>> { 
        
        const userResult = await this.userRepository.checkUniq(login, email)
        const authResult = await this.authRepository.checkUniq(login, email)
        
        if (userResult.data || authResult.data){
            const checkResult: string[] = userResult.data
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
    }
    
    async delete(id: string): Promise<StatusResult> {     
        let isExistUser = await this.userRepository.isExist(id);
        if (isExistUser.codResult == CodStatus.Ok)
            return await this.userRepository.delete(id);
        isExistUser = await this.authRepository.isExist(id);
        if (isExistUser.codResult == CodStatus.Ok)
            return await this.authRepository.delete(id);
        return {codResult : CodStatus.NotFound}
        
    }
    
    async clear(): Promise < StatusResult > {
        return await this.userRepository.clear()
    }  
    
    }
