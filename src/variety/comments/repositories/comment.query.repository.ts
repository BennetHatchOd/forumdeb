import { PaginatorType, QueryType} from "../../../types/types";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { CommentViewType } from "../types";
import { CommentDocument, CommentModel } from "../domain/comment.entity";
import { LikeService } from "../../likes/application/like.service";
import { Rating } from "../../likes/types";

export class CommentQueryRepository {

    constructor(private likeService: LikeService){}
    
    async findById(commentId: string, userId: string|undefined): Promise <CommentViewType | null > {      
        
        if(!ObjectId.isValid(commentId))
            return null;                   
        const searchItem: CommentDocument | null = await CommentModel.findOne({_id: new ObjectId(commentId)})           

        let likeStatus: Rating = Rating.None
        if(userId)
            likeStatus = await this.likeService.userRatingForComment(commentId, userId)
        
        return searchItem 
                ? this.mapDbToView(searchItem, likeStatus) 
                : null 
    }
  
    async find(postId: string, queryReq:  QueryType, userId: string|undefined): Promise < PaginatorType<CommentViewType> > {      
        
        const totalCount: number= await CommentModel.countDocuments({parentPostId: postId}) 
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
   
        if (totalCount == 0)
            return emptyPaginator;  
        
        const searchItem: Array<CommentDocument>   
                =    await CommentModel.find({parentPostId: postId})
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort({[queryReq.sortBy]: queryReq.sortDirection})
        const items = await Promise.all(searchItem.map(async s => { 
                                                                                    let statusLike: Rating = userId 
                                                                                            ? await this.likeService.userRatingForComment(s._id.toString(), userId)
                                                                                            : Rating.None
                                                                    return this.mapDbToView(s, statusLike)}))

        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items
        }
    }

    mapDbToView(item: CommentDocument, myStatus: Rating): CommentViewType {
        
        return {
            id: item._id.toString(),
            content: item.content,
            commentatorInfo:{
                userId:	item.commentatorInfo.userId.toString(),
                userLogin: item.commentatorInfo.userLogin	
            },
            createdAt:	item.createdAt.toISOString(),
            likesInfo:{
                likesCount: item.likesInfo.likes,
                dislikesCount: item.likesInfo.dislikes,
            },
            myStatus:  myStatus
        }       
    }
}
 