import { UserInputModel, APIErrorResult, FieldError, UserInnerModel } from "../../types";
import { userRepository } from "./repositories/userRepository"; 
import bcrypt from "bcrypt"

export const userService = {

 
    async create(createItem: UserInputModel): Promise < string | null>{      

        try{            
            const salt: string = bcrypt.genSaltSync(10);
            const hash: string = bcrypt.hashSync(createItem.password, salt)
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
            console.log(err)
            return null;
        }
    },

    async checkUniq(login: string, email: string): Promise <APIErrorResult| null >{     // creates new user and returns this user 

        try{            
            const checkResult: Array<string > = await userRepository.checkUniq(login, email)
            if(checkResult.length == 0)
                return null;
            
            let errorsMessages: Array<FieldError> = checkResult.map(s => {
                                                                        return {message: `${s} should be unique`,
                                                                                field: s}
                                                                        })

            return {
                errorsMessages: errorsMessages
                }
        } 
        catch (err){
            console.log(err)
            return null;
        }
    },
 
   async delete(id: string): Promise < boolean > {     // deletes a user by Id, returns true if the user existed    
        try{
            if (! await userRepository.isExist(id))
                return false;    

            return await userRepository.delete(id);
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    async clear(): Promise < boolean > {// deletes all users from base
        
        return await userRepository.clear()
    },

    
 
}
