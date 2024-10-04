import { PostViewModel, PostInputModel} from "../types";
import { PostDBType } from "../../../db/dbTypes";
import { postCollection } from "../../../db/db";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CodStatus, StatusResult } from "../../../interfaces";

export const postRepository = {
 
    async isExist(id: string): Promise<StatusResult> {     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await postCollection.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};

    },
     
    async create(createItem: PostDBType): Promise <StatusResult<string|undefined>>{ 
        const answerInsert: InsertOneResult = await postCollection.insertOne(createItem);
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    async edit(id: string, editData: PostInputModel, addingData = {}): Promise<StatusResult>{      
        const answerUpdate: UpdateResult = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {...editData, ...addingData}});
        if(!answerUpdate.acknowledged)
            return {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        
        return answerUpdate.matchedCount != 0 
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound}; 

    },
    
    async delete(id: string): Promise <StatusResult>{ 
        const answerDelete: DeleteResult = await postCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },
   
    async clear(): Promise<StatusResult>{
        await postCollection.deleteMany()
        return await postCollection.countDocuments({}) == 0 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error};  
    }

}