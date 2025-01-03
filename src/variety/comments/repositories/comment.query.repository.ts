import { PaginatorType, QueryType} from "../../../types/types";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { CommentViewType } from "../types";
import { CommentDocument, CommentModel } from "../domain/comment.entity";

export class CommentQueryRepository {

    async findById(id: string): Promise <CommentViewType | null > {      
        
        if(!ObjectId.isValid(id))
            return null;                   
        const searchItem: CommentDocument | null = await CommentModel.findOne({_id: new ObjectId(id)})           
        return searchItem 
                ? this.mapDbToView(searchItem) 
                : null 
    }
  
    async find(postId: string, queryReq:  QueryType): Promise < PaginatorType<CommentViewType> > {      
        
        const totalCount: number= await CommentModel.countDocuments({parentPostId: postId}) 
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
   
        if (totalCount == 0)
            return emptyPaginator;  
        
        const searchItem: Array<CommentDocument>   
                =    await CommentModel.find({parentPostId: postId})
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort({[queryReq.sortBy]: queryReq.sortDirection})
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToView(s))
        }
    }

    mapDbToView(item: CommentDocument): CommentViewType {
        
        return {
            id: item._id.toString(),
            content: item.content,
            commentatorInfo:{
                userId:	item.commentatorInfo.userId.toString(),
                userLogin: item.commentatorInfo.userLogin	
            },
            createdAt:	item.createdAt.toISOString(),
        }       
    }
}
 