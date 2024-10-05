import { userCollection } from "../../../db/db";
import { UserDBModel } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/interfaces";
import { UserPasswordModel } from "../types";

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
