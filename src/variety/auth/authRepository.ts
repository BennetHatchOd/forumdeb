import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { userCollection, userUnconfirmedCollection } from "../../db/db";
import { UserDBModel, UserUnconfirmedDBModel } from "../../db/dbTypes";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { AboutUser } from "./types";
import { ConfirmEmailModel, UserPasswordModel, UserUnconfirmedModel } from "../users/types";

export const authRepository = {
  
    async getUserByLoginEmail(loginOrEmail: string): Promise<StatusResult<{id:string, passHash:string}|undefined>> {      

        const checkedUser: WithId<UserDBModel>|null = await userCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
        
        return checkedUser === null 
            ? {codResult: CodStatus.NotFound} 
            : {codResult: CodStatus.Ok, data: {id:       checkedUser._id.toString(), 
                                               passHash: checkedUser.password}};
    },

    async findForOwnerById(id: string): Promise < StatusResult<AboutUser|undefined> > {     
             
        const searchItem: WithId<UserDBModel> | null = await userCollection.findOne({_id: new ObjectId(id)})  
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: { 
                email:      searchItem.email,      
                login:      searchItem.login,
                userId:     searchItem._id.toString()}
            }
    },

    async createConfirmUser(createItem: UserDBModel): Promise <StatusResult>{  
        

        const answerInsert: InsertOneResult = await userCollection.insertOne(createItem);
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async createUnconfirmUser(createItem: UserUnconfirmedDBModel): Promise <StatusResult>{  
        

        const answerInsert: InsertOneResult = await userUnconfirmedCollection.insertOne(createItem);
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async findByConfirmCode(code: string): Promise < StatusResult<UserUnconfirmedModel|undefined> > {     
             
        const searchItem: WithId<UserUnconfirmedDBModel> | null = 
            await userUnconfirmedCollection.findOne({'confirmEmail.code': code})  
        
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

    async deleteUncorfirmUser(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await userUnconfirmedCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async checkEmail(mail: string):  Promise <number>{      
        const searchItem: WithId<UserUnconfirmedDBModel> | null  
            = await userUnconfirmedCollection.findOne({'confirmEmail.mail': mail})

        return searchItem 
            ? searchItem.confirmEmail.countSendingCode  
            : -1
    },

    async updateCode(mail: string, confirmEmail: ConfirmEmailModel):  Promise <StatusResult>{    
    
        const update: UpdateResult 
        = await userUnconfirmedCollection.updateOne(
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
            = await userUnconfirmedCollection.findOne({$or: [{'user.login': login},{'user.email': email}]})           
        
        return checkUser === null &&  checkUncorfirmUser === null
            ? false 
            : true
    },

    async clear(): Promise <StatusResult> {
        await userUnconfirmedCollection.deleteMany()
        return await userCollection.countDocuments({}) == 0 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error, message: 'Collection isn\'t empty'};
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
