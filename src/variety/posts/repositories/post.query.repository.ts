import { QueryType, PaginatorType} from "../../../types/types";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { PostViewType } from "../types";
import { PostDocument, PostModel, PostType } from "../domain/post.entity";
import { LastLikesViewType, LikePost, PostsLastLikesViewType, Rating } from "../../likes/types";
import { LikeService } from "../../likes/application/like.service";
import { LastLikesType } from "../../likes/domain/last.likes.entity";

export class PostQueryRepository {

    constructor(private likeService: LikeService){}

    async findById(entityId: string, userId: string|undefined): Promise < PostViewType | null > {      
        
        if(!ObjectId.isValid(entityId))
            return null;      
        const searchItem: PostDocument | null 
                = await PostModel.findOne({_id: new ObjectId(entityId)})
        
        let likeStatus: Rating = Rating.None
        if(userId)
            likeStatus = await this.likeService.getUserRatingForEntity<PostType>(entityId, userId, LikePost)
    
        const lastLikes: Array<LastLikesViewType> = await this.likeService.getLastLikes(entityId)

        return searchItem 
            ? this.mapDbToView(searchItem, likeStatus, lastLikes) 
            : null;
    }

    async find(queryReq:  QueryType, userId: string|undefined): Promise < PaginatorType<PostViewType> > { 
        
        const bloqIdSearch = queryReq.blogId ? {blogId: queryReq.blogId} : {}   
        const queryFilter = {...bloqIdSearch}

        const totalCount: number= await PostModel.countDocuments(queryFilter)   
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        

        if (totalCount == 0)
            return emptyPaginator;
        
        const query= PostModel.find(queryFilter)
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort({[queryReq.sortBy]: queryReq.sortDirection})

        const searchItem: PostDocument[]  = await query.exec() 
        const postIds: string[] = searchItem.map(s => s._id.toString())

        const lastLikes: Array<PostsLastLikesViewType> = await this.likeService.getArrayLastLikes(postIds)

        if(!userId){
            const items = searchItem.map(post => { const newestLikes: Array<LastLikesViewType> 
                                                            = lastLikes.find(el => el.postId === post._id.toString())!.newestLikes
                                                    return this.mapDbToView(post, Rating.None, newestLikes)})
            return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items
            }
        }

        const statusLike: { id:     string;
                            rating: Rating }[] = await this.likeService.getRatingForEntities(postIds, userId, LikePost)

        const items: PostViewType[] = []

        for (let i = 0; i < postIds.length; i++){
            const newestLikes: Array<LastLikesViewType>  = lastLikes.find(el => el.postId === searchItem[i]._id.toString())!.newestLikes
        
            const rating = statusLike.find(el => el.id === searchItem[i]._id.toString())!.rating
            items.push(this.mapDbToView(searchItem[i], rating, newestLikes))
        }
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items
        }
 

    }

    mapDbToView(item: PostDocument, myStatus: Rating, lastLikes: Array<LastLikesViewType>): PostViewType {
        
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
                myStatus:  myStatus,
                newestLikes: lastLikes
            },
        }       
    }
 
}
 