import { commentQueryRepository } from "../../../instances";
import { CodStatus, StatusResult } from "../../../types/types";
import { CommentModel } from "../../comments/domain/comment.entity";
import { CommentRepository } from "../../comments/repositories/comment.repository";
import { LikeRepository } from "../repositories/like.repository";
import { Rating } from "../types";

export class LikeService{

    constructor(private likeRepository: LikeRepository,
                private commentRepository: CommentRepository
    ){}

    async getUserRatingForComment(commentId: string, userId: string): Promise<Rating>{
        const isLike = await this.likeRepository.hasCommentLike(commentId, userId, "myCommentRating")
        const isDislike = await this.likeRepository.hasCommentDislike(commentId, userId, "myCommentRating")


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

        const isLike =await this.likeRepository.hasCommentLike(commentId, userId, "myCommentRating")
        const isDislike =await this.likeRepository.hasCommentDislike(commentId, userId, "myCommentRating")

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
        await this.likeRepository.deleteUserLike(commentId, userId, "myCommentRating")
        await this.likeRepository.decrementLike(CommentModel, commentId)
    }
    async deleteDislike(commentId: string, userId: string){
        await this.likeRepository.deleteUserDislike(commentId, userId, "myCommentRating")
        await this.likeRepository.decrementDislike(CommentModel, commentId)
    }
    async addLike(commentId: string, userId: string){
        await this.likeRepository.addUserLike(commentId, userId, "myCommentRating")
        await this.likeRepository.incrementLike(CommentModel, commentId)
    }
    async addDislike(commentId: string, userId: string){                
        await this.likeRepository.addUserDislike(commentId, userId, "myCommentRating")
        await this.likeRepository.incrementDisLike(CommentModel, commentId)
    }
}