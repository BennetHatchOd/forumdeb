import { PaginatorType, QueryType} from "../../../types/types";
import { commentCollection } from "../../../db/db";
import { CommentDBType } from "../../../db/dbTypes";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { CommentViewType } from "../types";

export const commentQueryRepository = {

    async findById(id: string): Promise <CommentViewType | null > {      
        
        if(!ObjectId.isValid(id))
            return null;                   
        const searchItem: WithId<CommentDBType> | null = await commentCollection.findOne({_id: new ObjectId(id)})           
        return searchItem 
                ? this.mapDbToView(searchItem) 
                : null 
    },
  
    async find(postId: string, queryReq:  QueryType): Promise < PaginatorType<CommentViewType> > {      
        
        const totalCount: number= await commentCollection.countDocuments({parentPostId: postId}) 
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
   
        if (totalCount == 0)
            return emptyPaginator;  
        
        const searchItem: Array<WithId<CommentDBType>>   
                =    await commentCollection.find({parentPostId: postId})
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort(queryReq.sortBy, queryReq.sortDirection)
                                .toArray();
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToView(s))
        }
    },

    mapDbToView(item: WithId<CommentDBType>): CommentViewType {
        
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
 