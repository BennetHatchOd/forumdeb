import { PaginatorType, QueryType} from "../../../types/types";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { CommentViewType } from "../types";
import { CommentDocument, CommentModel, CommentType } from "../domain/comment.entity";
import { LikeService } from "../../likes/application/like.service";
import { LikeComment, Rating } from "../../likes/types";

export class CommentQueryRepository {

    constructor(private likeService: LikeService){}
    
    async findById(entityId: string, userId: string|undefined): Promise <CommentViewType | null > {      
        
        if(!ObjectId.isValid(entityId))
            return null;                   
        const searchItem: CommentDocument | null 
                = await CommentModel.findOne({_id: new ObjectId(entityId)})           

        let likeStatus: Rating = Rating.None
        if(userId)
            likeStatus = await this.likeService.getUserRatingForEntity<CommentType>(entityId, userId, LikeComment)
        
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

        if(!userId){
            const items = searchItem.map(s => {return this.mapDbToView(s, Rating.None)})
            return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items
            }
        }
        const commentIds = searchItem.map(s => s._id.toString())
        const statusLike = await this.likeService.getRatingForEntities(commentIds, userId, LikeComment)

        const items: CommentViewType[] = []

        for (let i = 0; i < commentIds.length; i++){
            items.push(this.mapDbToView(searchItem[i], statusLike[i].rating))
        }
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
                likesCount: item.likesInfo.likesCount,
                dislikesCount: item.likesInfo.dislikesCount,
                myStatus:  myStatus
            },
        }       
    }
}
 