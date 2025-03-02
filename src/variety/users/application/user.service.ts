//import { CodStatus, StatusResult } from "../../../types/interfaces";
import { APIErrorResult, CodStatus, FieldError, StatusResult} from "../../../types/types";
import { UserRepository } from "../repositories/user.repository"; 
import { UserInputType } from "../types";
import { UserModel, UserType } from "../domain/user.entity";
import { AuthRepository } from "../../auth/repositories/auth.repository";
import { PasswordHashAdapter } from "../../../adapters/password.hash.adapter";

export class UserService {
   
    constructor(private userRepository: UserRepository,
                private authRepository: AuthRepository, 
                private passwordHashAdapter: PasswordHashAdapter){ 
            }

    async create(createItem: UserInputType): Promise<StatusResult<string|APIErrorResult>>{     
        //  returns CodResult with: id-string of the created object, 
        //  or an array of errors, if the login or email is duplicated

        const isUniq: StatusResult<APIErrorResult|undefined> = await this.checkUniq(createItem.login, createItem.email)
        if(isUniq.codResult == CodStatus.BadRequest)
            return isUniq as StatusResult<APIErrorResult>;
        
        const hash: string = await this.passwordHashAdapter.createHash(createItem.password)
        const newUser: UserType = {
                                login: createItem.login,
                                email: createItem.email,
                                password: hash, 
                                createdAt: new Date(),
                                isConfirmEmail: true,
                                confirmEmail: {
                                    code: "0",
                                    expirationTime: new Date(),
                                    countSendingCode: 0
                                }
                            }

        return await this.userRepository.create(newUser) as StatusResult<string>
    }
    
    async checkUniq(login: string, email: string): Promise<StatusResult<APIErrorResult| undefined>> { 
        
        const userResult = await this.userRepository.checkUniq(login, email)
        
        if (userResult.data){
            const checkResult: string[]|undefined = userResult.data
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
        if (isExistUser)
            return await this.userRepository.delete(id);

        return {codResult : CodStatus.NotFound}        
    }
    
    async clear(): Promise < StatusResult > {
        return await this.userRepository.clear()
    }  
    
    }
