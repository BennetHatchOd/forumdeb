import { userCollection } from "../../../db/db";
import { UserDBModel } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId, WithId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/interfaces";
import { UserPasswordModel } from "../types";
import { AboutUser } from "../../auth/types";

export const userRepository = {
  
    async isExist(id: string): Promise<StatusResult>{     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await userCollection.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    },
 
    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|undefined>> {
        
        const existEmail = await userCollection.countDocuments({ email: emailCheck })
        const existLogin = await userCollection.countDocuments({ login: loginCheck })

        let arrayErrors: Array<string> = [] 
        if(existEmail > 0) 
            arrayErrors.push('email') 
        if(existLogin > 0) 
            arrayErrors.push('login')

        return arrayErrors.length == 0
            ?  {codResult: CodStatus.Ok}
            :  {codResult: CodStatus.BadRequest, data: arrayErrors};
    },
   
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

    async create(createItem: UserDBModel): Promise <StatusResult<string|undefined>>{  
        
        const answerInsert: InsertOneResult = await userCollection.insertOne(createItem);
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },
    
    async delete(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async clear(): Promise <StatusResult> {
        await userCollection.deleteMany()
        return await userCollection.countDocuments({}) == 0 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error, message: 'Collection isn\'t empty'};
    },
}
