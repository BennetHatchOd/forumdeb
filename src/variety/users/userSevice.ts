import { UserInputModel, APIErrorResult, FieldError, UserInnerModel, LoginInputModel } from "../../types";
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

    async authUser(loginOrEmail: string, password: string): Promise < boolean > {      
        try{
            const hash: string | null = await userRepository.checkExist(loginOrEmail)
            if(hash === null) return false;
            
            return await bcrypt.compare(password, hash)

        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    isValid(loginOrEmail: string, password: string): boolean | APIErrorResult {          
        const answerError: APIErrorResult = {
            errorsMessages: []}
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


    async checkUniq(login: string, email: string): Promise<APIErrorResult| null> { 

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
