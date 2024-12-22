import { commentCollection } from "../../../db/db";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CodStatus, StatusResult} from "../../../types/interfaces";
import { CommentFullType, CommentInputType, CommentViewType } from "../types";
import { CommentDBType } from "../../../db/dbTypes";

export const commentRepository = {

    async isExist(id: string): Promise < StatusResult > {     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await commentCollection.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    },
 
    async findById(id: string): Promise < StatusResult<CommentFullType|undefined> > {     
        
         
        if(!ObjectId.isValid(id))
            return {codResult: CodStatus.NotFound};
        const searchItem: WithId<CommentDBType> | null = await commentCollection.findOne({_id: new ObjectId(id)})           
        return searchItem  
            ? {codResult: CodStatus.Ok, data: this.mapDbToFull(searchItem)} 
            : {codResult: CodStatus.NotFound};
    },

    async create(createItem: CommentDBType): Promise <StatusResult<string|undefined>>{      
        const answerInsert: InsertOneResult = await commentCollection.insertOne(createItem)
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    
    async edit(id: string, editDate: CommentInputType): Promise <StatusResult>{    
        const answerUpdate: UpdateResult = await commentCollection.updateOne({_id: new ObjectId(id)}, {$set: editDate});
        if(!answerUpdate.acknowledged)
            return {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        
        return answerUpdate.matchedCount != 0 
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound}; 
    },

    async delete(id: string): Promise <StatusResult> {         
        const answerDelete: DeleteResult = await commentCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
               ? {codResult: CodStatus.NoContent}  
               : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },


    async clear(): Promise <StatusResult> { 
        await commentCollection.deleteMany()

        return await commentCollection.countDocuments({}) == 0 
           ? {codResult: CodStatus.NoContent }  
           : {codResult: CodStatus.Error};
    
    },

    mapDbToFull(item: WithId<CommentDBType>): CommentFullType {
        
        return {
            id: item._id.toString(),
            content: item.content,
            createdAt: item.createdAt,
            commentatorInfo: {  userId: item.commentatorInfo.userId,
                                userLogin: item.commentatorInfo.userLogin},
            parentPostId: item.parentPostId
        }       
    }

}

