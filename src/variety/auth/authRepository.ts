import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { userCollection, authUserCollection, tokenCollection, requestCollection } from "../../db/db";
import { BlackListModel, TokenListDB, UserDBModel, UserUnconfirmedDBModel } from "../../db/dbTypes";
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
            data: this.mapAuthDBToFull(searchItem) 
            }
    },

    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|undefined>> {
        
        const existEmail = await authUserCollection.countDocuments({ "user.email": emailCheck })
        const existLogin = await authUserCollection.countDocuments({ "user.login": loginCheck })

        let arrayErrors: Array<string> = [] 
        if(existEmail > 0) 
            arrayErrors.push('email') 
        if(existLogin > 0) 
            arrayErrors.push('login')

        return arrayErrors.length == 0
            ?  {codResult: CodStatus.Ok}
            :  {codResult: CodStatus.BadRequest, data: arrayErrors};
    },

    async checkNotVerifEmail(mail: string):  Promise <number>{      
        const searchItem: WithId<UserUnconfirmedDBModel> | null  
            = await authUserCollection.findOne({'user.email': mail})
        return searchItem 
            ? searchItem.confirmEmail.countSendingCode  
            : -1
    },
    
    async getBlackList(userId: string): Promise<Array<BlackListModel>|null>{

        const foundUser: TokenListDB|null = await tokenCollection.findOne({userId: userId})
        return foundUser 
            ? foundUser.blackList
            : null

    },
    async setBlackList(userId: string, list: Array<BlackListModel> ):Promise<StatusResult>{
        const foundUser = await tokenCollection.countDocuments({userId: userId})
        const answer = (foundUser == 0)
            ? await tokenCollection.insertOne({userId: userId, blackList: list})
            : await tokenCollection.updateOne({userId: userId}, {$set: {blackList: list}})
        
        return answer.acknowledged  
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};

    },

    async updateCode(mail: string, confirmEmail: ConfirmEmailModel):  Promise <StatusResult>{    
    
        const update: UpdateResult 
        = await authUserCollection.updateOne(
                {'user.email': mail},
                {$set: {confirmEmail: confirmEmail}})
    
        return update.modifiedCount == 1
            ? {codResult: CodStatus.NoContent}
            : {codResult: CodStatus.Error}        
    },

    async setRequestAPI(ip:string, url:string, date: Date){
        await requestCollection.insertOne({ip:   ip,
                                           url:  url,
                                           date: date})
    },

    async getNumberRequestAPI(ip:string, url:string, dateFrom: Date){
        return await requestCollection.countDocuments({ip: ip, url: url, date: {$gte: dateFrom}})
    },


    // async checkUserByLoginEmail(login: string, email: string): Promise<StatusResult<UserPasswordModel|UserUnconfirmedModel|undefined>> {      

    //     const checkUser: WithId<UserDBModel>|null 
    //         = await userCollection.findOne({$or: [{login: login},{email: email}]})           
    //     const checkUncorfirmUser: WithId<UserUnconfirmedDBModel>|null 
    //         = await authUserCollection.findOne({$or: [{'user.login': login},{'user.email': email}]})           
        
    //     if (!checkUser) 
    //         if (!checkUncorfirmUser)
    //             return {codResult: CodStatus.NotFound}
    //         else{
    //             return {codResult: CodStatus.Ok, message: 'auth', data: this.mapAuthDBToFull(checkUncorfirmUser)}
    //         }
        
    //         return {codResult: CodStatus.Ok, message: 'user', data: this.mapUserDBToFull(checkUser)}    
    // },

    async clear(): Promise <StatusResult> {
        await authUserCollection.deleteMany()
        await tokenCollection.deleteMany()
        return await authUserCollection.countDocuments({}) == 0 
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
    },

    mapUserDBToFull(user: WithId<UserDBModel>): UserPasswordModel {
        return { 
            id:         user._id.toString(),
            email:      user.email,      
            login:      user.login,
            password:   user.password,
            createdAt:	user.createdAt
            }
    },

    mapAuthDBToFull(user: WithId<UserUnconfirmedDBModel >): UserUnconfirmedModel  {
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
