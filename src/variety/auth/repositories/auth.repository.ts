import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/types";
import { AuthDocument, AuthModel, AuthUserType } from "../domain/auth.entity";
import { ConfirmEmailType, UserPasswordType, UserUnconfirmedType } from "../../users/types";
import { UserDocument } from "../../users/domain/user.entity";
import { RequestModel } from "../domain/request.entity";
import { NewPasswordDocument, NewPasswordModel, newPasswordType } from "../domain/newPassword.entity";

export class AuthRepository {
  
    async createUnconfirmUser(createItem: AuthUserType): Promise <StatusResult>{  
        

        await AuthModel.create(createItem);
  
        return {codResult: CodStatus.NoContent}  
        //    : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    }

    async findByConfirmCode(code: string): Promise < StatusResult<UserUnconfirmedType|undefined> > {     
             
        const searchItem: AuthDocument | null = await AuthModel.findOne({'confirmEmail.code': code})  
        
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: this.mapAuthToFull(searchItem) 
            }
    }

    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|undefined>> {
    // checking for unverified users

        const existEmail = await AuthModel.countDocuments({ "user.email": emailCheck })
        const existLogin = await AuthModel.countDocuments({ "user.login": loginCheck })

        let arrayErrors: Array<string> = [] 
        if(existEmail > 0) 
            arrayErrors.push('email') 
        if(existLogin > 0) 
            arrayErrors.push('login')

        return arrayErrors.length == 0
            ?  {codResult: CodStatus.Ok}
            :  {codResult: CodStatus.BadRequest, data: arrayErrors};
    }

    async checkNotVerifEmail(mail: string):  Promise <number>{      
        const searchItem: AuthDocument | null  
            = await AuthModel.findOne({'user.email': mail})

        return searchItem 
            ? searchItem.confirmEmail.countSendingCode  
            : -1
    }
    
    async updateEmailCode(mail: string, confirmEmail: ConfirmEmailType):  Promise <StatusResult>{    
    
        const update: AuthDocument | null = await AuthModel.findOne({'user.email': mail})
        
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

    async clear(): Promise <StatusResult> {
        await AuthModel.deleteMany()
        if(await AuthModel.countDocuments({}) == 0) 
            return {codResult: CodStatus.NoContent }  
        throw 'Collection isn\'t empty'
    }

    async isExist(id: string): Promise<StatusResult>{     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await AuthModel.countDocuments({_id: new ObjectId(id)})           
        
        return exist == 1  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    }
 
    async delete(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await AuthModel.deleteOne({_id: new ObjectId(id)})

        if(answerDelete.deletedCount == 1) 
            return {codResult: CodStatus.NoContent}  
        throw 'the server didn\'t confirm the delete operation';
    }

    mapUserToFull(user: UserDocument): UserPasswordType {
        return { 
            id:         user._id.toString(),
            email:      user.email,      
            login:      user.login,
            password:   user.password,
            createdAt:	user.createdAt
            }
    }

    mapAuthToFull(user: AuthDocument): UserUnconfirmedType  {
        return { 
            id:         user._id.toString(),
            user:{
                email:      user.user.email,      
                login:      user.user.login,
                password:   user.user.password,
                createdAt:	user.user.createdAt
            },
            confirmEmail: {
                code: user.confirmEmail.code,
                expirationTime: user.confirmEmail.expirationTime,
                countSendingCode: user.confirmEmail.countSendingCode
            }}
    }
}
