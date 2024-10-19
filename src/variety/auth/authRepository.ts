import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { userCollection, authUserCollection } from "../../db/db";
import { UserDBModel, UserUnconfirmedDBModel } from "../../db/dbTypes";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { ConfirmEmailModel, UserPasswordModel, UserUnconfirmedModel } from "../users/types";

export const authRepository = {
  
    async createUnconfirmUser(createItem: UserUnconfirmedDBModel): Promise <StatusResult>{  
        

        const answerInsert: InsertOneResult = await authUserCollection.insertOne(createItem);
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async findByConfirmCode(code: string): Promise < StatusResult<UserUnconfirmedModel|undefined> > {     
             
        const searchItem: WithId<UserUnconfirmedDBModel> | null = 
            await authUserCollection.findOne({'confirmEmail.code': code})  
        
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: { 
                id:         searchItem._id.toString(),
                user:{
                    email:      searchItem.user.email,      
                    login:      searchItem.user.login,
                    password:   searchItem.user.password,
                    createdAt:	searchItem.user.createdAt
                },
                confirmEmail: {
                    code: searchItem.confirmEmail.code,
                    expirationTime: searchItem.confirmEmail.expirationTime,
                    countSendingCode: searchItem.confirmEmail.countSendingCode
                }}
            }
    },

    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|undefined>> {
        
        const existEmail = await authUserCollection.countDocuments({ email: emailCheck })
        const existLogin = await authUserCollection.countDocuments({ login: loginCheck })

        let arrayErrors: Array<string> = [] 
        if(existEmail > 0) 
            arrayErrors.push('email') 
        if(existLogin > 0) 
            arrayErrors.push('login')

        return arrayErrors.length == 0
            ?  {codResult: CodStatus.Ok}
            :  {codResult: CodStatus.BadRequest, data: arrayErrors};
    },

    async checkEmail(mail: string):  Promise <number>{      
        const searchItem: WithId<UserUnconfirmedDBModel> | null  
            = await authUserCollection.findOne({'confirmEmail.mail': mail})

        return searchItem 
            ? searchItem.confirmEmail.countSendingCode  
            : -1
    },

    async updateCode(mail: string, confirmEmail: ConfirmEmailModel):  Promise <StatusResult>{    
    
        const update: UpdateResult 
        = await authUserCollection.updateOne(
                {'user.mail': mail},
                {$set: {confirmEmail: confirmEmail}})
    
        return update.modifiedCount == 1
            ? {codResult: CodStatus.NoContent}
            : {codResult: CodStatus.Error}        
    },

    async checkUserByLoginEmail(login: string, email: string): Promise<boolean> {      

        const checkUser: WithId<UserDBModel>|null 
            = await userCollection.findOne({$or: [{login: login},{email: email}]})           
        const checkUncorfirmUser: WithId<UserUnconfirmedDBModel>|null 
            = await authUserCollection.findOne({$or: [{'user.login': login},{'user.email': email}]})           
        
        return checkUser === null &&  checkUncorfirmUser === null
            ? false 
            : true
    },

    async clear(): Promise <StatusResult> {
        await authUserCollection.deleteMany()
        return await userCollection.countDocuments({}) == 0 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error, message: 'Collection isn\'t empty'};
    },

    async isExist(id: string): Promise<StatusResult>{     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await authUserCollection.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    },
 
    async delete(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await authUserCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    mapViewToDB(user: UserPasswordModel): WithId<UserDBModel> {
        return{
            _id:	new ObjectId(user.id),
            login:	user.login,
            email:	user.email,
            createdAt:	user.createdAt,
            password: user.password,
        }
    }
}
