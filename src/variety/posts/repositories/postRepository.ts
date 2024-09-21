import { PostViewModel, PostInputModel, BlogViewModel } from "../../../types";
import { PostDBType } from "../../../db/dbTypes";
import { postCollection } from "../../../db/db";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { CodStatus, StatusResult } from "../../../interfaces";
import { catchErr } from "../../../modules/catchErr";

export const postRepository = {
 
    async isExist(id: string): Promise<StatusResult> {     
        
        try{
            if(!ObjectId.isValid(id))    
                return {codResult : CodStatus.NotFound};

            const exist: number = await postCollection.countDocuments({_id: new ObjectId(id)})           
            
            return exist > 0  
                  ? {codResult: CodStatus.Created} 
                  : {codResult: CodStatus.NotFound};
        } 
        catch (err){
            return catchErr(err);
        }
    },
     
    async create(createItem: PostViewModel): Promise <StatusResult<string|null>>{ 
        try{
            const answerInsert: InsertOneResult = await postCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async edit(id: string, editData: PostInputModel, addingData = {}): Promise<StatusResult>{   
        
        try{
            const answerUpdate: UpdateResult = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {...editData, ...addingData}});
            if(!answerUpdate.acknowledged)
                return {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
            
            return answerUpdate.matchedCount != 0 
                 ? {codResult: CodStatus.NoContent} 
                 : {codResult: CodStatus.NotFound}; 
        } 
        catch (err){
            return catchErr(err);
        }
    },
    
    async delete(id: string): Promise <StatusResult>{ 
        try{
             const answerDelete: DeleteResult = await postCollection.deleteOne({_id: new ObjectId(id)})

             return answerDelete.deletedCount == 1 ?
                    {codResult: CodStatus.NoContent} : 
                    {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },
   
    async clear(): Promise<StatusResult>{
        try{
            await postCollection.deleteMany()
            return await postCollection.countDocuments({}) == 0 ?
                {codResult: CodStatus.NoContent } : 
                {codResult: CodStatus.Error};
        } 
        catch(err){
            return catchErr(err);
        }
    },

    mapViewToDb(item: PostViewModel): PostDBType {
        const _id: ObjectId = ObjectId.isValid(item.id) ? new ObjectId(item.id) : new ObjectId;    

        return { 
            _id: _id,
            title: item.title,
            shortDescription: item.shortDescription,
            createdAt: item.createdAt,
            blogId: item.blogId,
            blogName: item.blogName,
            content: item.content
            }
                   
        }
}