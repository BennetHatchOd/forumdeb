import { DeleteResult, ObjectId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/types";
import { UserDocument, UserModel, UserType } from "../../users/domain/user.entity";
import { RequestModel } from "../domain/request.entity";
import { NewPasswordDocument, NewPasswordModel, newPasswordType } from "../domain/newPassword.entity";
import { UserIdType } from "../../users/types";
import { ConfirmEmailType } from "../domain/confirm.email.entity";

export class AuthRepository {
  
    async createUser(createItem: UserType): Promise <StatusResult>{   

        await UserModel.create(createItem);
  
        return {codResult: CodStatus.NoContent}  
    }

    async findByConfirmCode(code: string): Promise < StatusResult<UserIdType|undefined> > {     
             
        const searchItem: UserDocument | null = await UserModel.findOne({'confirmEmail.code': code, isConfirmEmail: false})  
        
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: this.mapUserToFull(searchItem) 
            }
    }

    async confirm(userId: string): Promise <void> {     
             
        const searchItem: UserDocument | null = await UserModel.findOne({_id: userId.toString(), isConfirmEmail: false})  
        
        if(!searchItem)
            throw "user not found"
        
        searchItem.isConfirmEmail = true
        await searchItem.save()
    }


    async checkNotVerifEmail(mail: string):  Promise <number>{      
        const searchItem: UserDocument | null  
            = await UserModel.findOne({email: mail, isConfirmEmail: false})

        return searchItem 
            ? searchItem.confirmEmail.countSendingCode  
            : -1
    }
    
    async updateEmailCode(mail: string, confirmEmail: ConfirmEmailType):  Promise <StatusResult>{    
    
        const update: UserDocument | null = await UserModel.findOne({email: mail, isConfirmEmail: false})
        
        if(!update) throw "user not found"
        
        update.confirmEmail = confirmEmail
        await update.save()
       
        return {codResult: CodStatus.NoContent}   
    }

    async setRequestAPI(ip:string, url:string, date: Date){
        await RequestModel.create({ip:   ip,
                                  url:  url,
                                 date: date})
    }

    async getNumberRequestAPI(ip:string, url:string, dateFrom: Date){
        return await RequestModel.countDocuments({ip: ip, url: url, date: {$gte: dateFrom}})
    }

    async createPasswordCode(passwordCode: newPasswordType): Promise<StatusResult> {      

        let user: NewPasswordDocument|null = await NewPasswordModel.findOne({userId: passwordCode.userId})
        if(!user)
            user = new NewPasswordModel(passwordCode)
        else{
            user.code = passwordCode.code
            user.expirationTime = passwordCode.expirationTime
        }
        await user.save()

        return {codResult: CodStatus.Ok}    
    }

    async findPasswordRecovery(recoveryCode: string): Promise<StatusResult<{userId: string, expirationTime: Date}|undefined>>{
        const user: NewPasswordDocument|null = await NewPasswordModel.findOne({code: recoveryCode})
        if(user)
            return{codResult: CodStatus.Ok ,data: {userId: user.userId, expirationTime: user.expirationTime}}

        return {codResult: CodStatus.NotFound}
    }

    async deletePasswordRecovery(userId: string){
        await NewPasswordModel.deleteOne({userId: userId})
    }

    async delete(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})

        if(answerDelete.deletedCount == 1) 
            return {codResult: CodStatus.NoContent}  
        throw 'the server didn\'t confirm the delete operation';
    }

    mapUserToFull(user: UserDocument): UserIdType  {
        return { 
            id:         user._id.toString(),
            email:      user.email,      
            login:      user.login,
            password:   user.password,
            createdAt:	user.createdAt,
            isConfirmEmail: user.isConfirmEmail!,
            confirmEmail: user.confirmEmail
        }
    }
}
