import {PostInputType} from "../types";
import { DeleteResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/types";
import { PostDocument, PostModel, PostType } from "../domain/post.entity";

export class PostRepository {
 
    async isExist(id: ObjectId): Promise<StatusResult> {     
        
        const exist: number = await PostModel.countDocuments({_id: id})           
        
        return exist != 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};

    }
     
    async create(createItem: PostType): Promise <StatusResult<ObjectId>>{ 
        const post: PostDocument = await PostModel.create(createItem);

        return {codResult: CodStatus.Created, data: post._id}  
    }

    async edit(id: ObjectId, editData: PostInputType, addingData: {blogName: string}): Promise<StatusResult<{}>>{
              
        const answerUpdate: UpdateResult = await PostModel.updateOne({_id: id}, {$set: {...editData, ...addingData}});
        if(!answerUpdate.acknowledged)
            throw 'the server didn\'t confirm the edit-operation'
        
        return answerUpdate.matchedCount != 0 
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound}; 

    }
    
    async delete(id: ObjectId): Promise <StatusResult>{ 
        const answerDelete: DeleteResult = await PostModel.deleteOne({_id: id})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.NotFound};
    }
   
    async clear(): Promise<StatusResult>{
        await PostModel.deleteMany()
        return await PostModel.countDocuments({}) == 0 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error};  
    }
}