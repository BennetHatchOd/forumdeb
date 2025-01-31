import { QueryType, PaginatorType} from "../../../types/types";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { PostViewType } from "../types";
import { PostDocument, PostModel, PostType } from "../domain/post.entity";
import { LikePost, Rating } from "../../likes/types";
import { LikeService } from "../../likes/application/like.service";

export class PostQueryRepository {

    constructor(private likeService: LikeService){}

    async findById(postId: string, userId: string|undefined): Promise < PostViewType | null > {      
        
    
        const searchItem: PostDocument | null 
                = await PostModel.findOne({_id: postId})
        
        let likeStatus: Rating = Rating.None
        if(userId)
            likeStatus = await this.likeService.getUserRatingForEntity<PostType>(postId, userId, LikePost)
    

        return searchItem 
            ? this.mapDbToView(searchItem, likeStatus) 
            : null;
    }

    async find(queryReq:  QueryType): Promise < PaginatorType<PostViewType> > { 
        
        const bloqIdSearch = queryReq.blogId ? {blogId: queryReq.blogId} : {}   
        const queryFilter = {...bloqIdSearch}
        
        const totalCount: number= await PostModel.countDocuments(queryFilter)   
        
        if (totalCount == 0)
            return emptyPaginator;
        
        const query = PostModel.find(queryFilter)
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort({[queryReq.sortBy]: queryReq.sortDirection})

        const searchItem = await query.exec() 

        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToView(s))
            } 
 

    }

    mapDbToView(item: PostDocument, myStatus: Rating): PostViewType {
        
        return { 
            id: item._id.toString(),
            title:	item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            createdAt: item.createdAt.toISOString(),
            blogId:	item.blogId.toString(),
            blogName:	item.blogName,
            extendedLikesInfo:{
                likesCount: item.likesInfo.likesCount,
                dislikesCount: item.likesInfo.dislikesCount,
                myStatus:  myStatus
            },
        }       
    }
 
}
 