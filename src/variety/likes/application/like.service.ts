import { commentQueryRepository } from "../../../instances";
import { CodStatus, StatusResult } from "../../../types/types";
import { CommentRepository } from "../../comments/repositories/comment.repository";
import { LikeRepository } from "../repositories/like.repository";
import { Rating } from "../types";

export class LikeService{

    constructor(private likeRepository: LikeRepository,
                private commentRepository: CommentRepository
    ){}

    async userRatingForComment(commentId: string, userId: string): Promise<Rating>{
        const isLike = await this.likeRepository.hasCommentLike(commentId, userId)
        const isDislike = await this.likeRepository.hasCommentDislike(commentId, userId)


        if(isLike)
            return Rating.Like
        if(isDislike)
            return Rating.Dislike
        return Rating.None
    }

    async setRangeComment(commentId: string, likeStatus: Rating, userId: string): Promise<StatusResult>{
        
        const existAnswer = await this.commentRepository.isExist(commentId)

        if(existAnswer.codResult == CodStatus.NotFound)
            return existAnswer
        
        const isLike =await this.likeRepository.hasCommentLike(commentId, userId)
        const isDislike =await this.likeRepository.hasCommentDislike(commentId, userId)

        const isNone = !isLike && !isDislike
        
        if(likeStatus == Rating.Like){
            if(isNone){
                await this.addLike(commentId, userId)
            }
            
            if(isDislike){
                await this.deleteDislike(commentId, userId)
                await this.addLike(commentId, userId)
            }            
        }

        if(likeStatus == Rating.Dislike){           
            if(isNone){
                   await this.addDislike(commentId, userId)
            }           
            if(isLike){
                await this.deleteLike(commentId, userId)
                await this.addDislike(commentId, userId)
            }         
        }
        if(likeStatus == Rating.None){    
            if(isLike){
                await this.deleteLike(commentId, userId)
            }
            if(isDislike){
                await this.deleteDislike(commentId, userId)
            }
        }

        return {codResult: CodStatus.NoContent}    
    }

    async deleteLike(commentId: string, userId: string){
        await this.likeRepository.deleteUserLike(commentId, userId)
        await this.likeRepository.decCommentLike(commentId)
    }
    async deleteDislike(commentId: string, userId: string){
        await this.likeRepository.deleteUserDislike(commentId, userId)
        await this.likeRepository.decCommentDislike(commentId)
    }
    async addLike(commentId: string, userId: string){
        await this.likeRepository.addUserLike(commentId, userId)
        await this.likeRepository.incCommentLike(commentId)
    }
    async addDislike(commentId: string, userId: string){                
        await this.likeRepository.addUserDislike(commentId, userId)
        await this.likeRepository.incCommentDisLike(commentId)
    }
}