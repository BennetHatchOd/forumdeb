import { DeleteResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CommentInputType } from "../types";
import { CodStatus, StatusResult } from "../../../types/types";
import { CommentDocument, CommentModel, CommentType } from "../domain/comment.entity";

export class CommentRepository {

    constructor(){
    }

    async isExist(id: string): Promise < StatusResult > {     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await CommentModel.countDocuments({_id: new ObjectId(id)})           
        
        return exist != 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    }
 
    async findById(id: string): Promise < StatusResult<WithId<CommentType>|undefined> > {           
         
        if(!ObjectId.isValid(id))
            return {codResult: CodStatus.NotFound};
        const searchItem: CommentDocument | null = await CommentModel.findOne({_id: new ObjectId(id)})           
        return searchItem  
            ? {codResult: CodStatus.Ok, data: this.mapDbToFull(searchItem)} 
            : {codResult: CodStatus.NotFound};
    }

    async create(createItem: CommentType): Promise <StatusResult<string|undefined>>{      
        const answerInsert: CommentDocument = await CommentModel.create(createItem)
        return {codResult: CodStatus.Created, data: answerInsert._id.toString()}  
    }

    async edit(id: string, editDate: CommentInputType): Promise <StatusResult>{    
        const answerUpdate: UpdateResult = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: editDate});
        if(!answerUpdate.acknowledged)
            throw 'the server didn\'t confirm the operation'
        
        return answerUpdate.matchedCount != 0 
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound}; 
    }

    async delete(id: string): Promise <StatusResult> {         
        const answerDelete: DeleteResult = await CommentModel.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
               ? {codResult: CodStatus.NoContent}  
               : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    }

    async clear(): Promise <StatusResult> { 
        await CommentModel.deleteMany()

        if (await CommentModel.countDocuments({}) == 0) 
           return {codResult: CodStatus.NoContent }  
        
        throw "error of deleting collection";
    
    }
    mapDbToFull(item:CommentDocument): WithId<CommentType> {
        
        return {
            _id: item._id,
            content: item.content,
            createdAt: item.createdAt,
            commentatorInfo: {  userId: item.commentatorInfo.userId,
                                userLogin: item.commentatorInfo.userLogin},
            parentPostId: item.parentPostId,
            likesInfo:{
                likesCount: item.likesInfo.likesCount,
                dislikesCount: item.likesInfo.dislikesCount,
            }
        }       
    }

}

