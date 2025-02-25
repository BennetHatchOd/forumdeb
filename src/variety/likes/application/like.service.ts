import { Model } from "mongoose";
import { CodStatus, StatusResult } from "../../../types/types";
import { LikeType } from "../domain/likes.entity";
import { Likeable } from "../domain/likes.recipient.entity";
import { LikeRepository } from "../repositories/like.repository";
import { LastLikesViewType, LikeRecipient, PostsLastLikesViewType, Rating } from "../types";
import { LastLikesType } from "../domain/last.likes.entity";

export class LikeService{

    constructor(private likeRepository: LikeRepository){}

    async getUserRatingForEntity<T extends Likeable>(entityId: string, userId: string, likeRecipient: LikeRecipient<T>): Promise<Rating>{
        const [isLike, isDislike] = await this.hasLikeDislike(likeRecipient.collectionModel, entityId, userId)

        if(isLike)
            return Rating.Like
        if(isDislike)
            return Rating.Dislike
        return Rating.None
    }

    async getRatingForEntities<T extends Likeable>(entitiesId: Array<string>, userId: string, likeRecipient: LikeRecipient<T>)
            :Promise<Array<{id:string, rating: Rating}>>{
      
        const statuses: Array<{targetId: string, rating: Rating}> 
        = await this.likeRepository.hasArrayLikeDislikes(likeRecipient.collectionModel, entitiesId, userId)

        return entitiesId.map(s => {let status = Rating.None
                                    const statusIndex = statuses.find(j => s === j.targetId)
                                    if(statusIndex)
                                        status = statusIndex.rating
                                    return{id:s, rating: status}})        
    }

    async setRangeEntity<T extends Likeable>(entityId: string, likeStatus: Rating, userId: string, likeRecipient: LikeRecipient<T>): Promise<StatusResult>{
        
        const [isLike, isDislike] = await this.hasLikeDislike(likeRecipient.collectionModel, entityId, userId)

        const isNone = !isLike && !isDislike
      

        if(likeStatus == Rating.Like){
            if(isNone){
                await this.addLike(entityId, userId, likeRecipient)
            }
            
            if(isDislike){
                await Promise.all([this.deleteDislike(entityId, userId, likeRecipient),
                                   this.addLike(entityId, userId, likeRecipient)])
            }            
        }

        if(likeStatus == Rating.Dislike){           
            if(isNone){
                   await this.addDislike(entityId, userId, likeRecipient)
            }           
            if(isLike){
                await Promise.all([ this.deleteLike(entityId, userId, likeRecipient),
                                    this.addDislike(entityId, userId, likeRecipient)])
            }         
        }
        if(likeStatus == Rating.None){    
            if(isLike){
                await this.deleteLike(entityId, userId, likeRecipient)
            }
            if(isDislike){
                await this.deleteDislike(entityId, userId, likeRecipient)
            }
        }
        return {codResult: CodStatus.NoContent}    
    }

    async getLastLikes(postId: string): Promise<Array<LastLikesViewType>>{
        
        return await this.likeRepository.getLastLikes(postId)
    }

    async getArrayLastLikes(postIds: string[]): Promise<Array<PostsLastLikesViewType>>{
        
        return await this.likeRepository.getArrayLastLikes(postIds)
    }

    
    async hasLikeDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string):Promise<[boolean, boolean]>{

        const documents = await this.likeRepository.hasLikeDislike( model, entityId, userId)

        if(documents.length > 1)
            throw new Error("too many likes")
        
        if( documents.length == 0)
            return [false, false]
                
        if(documents[0].rating == Rating.Like)
            return [true, false]

        if(documents[0].rating == Rating.Dislike)
            return [false, true]

        throw new Error("Wrong like status")

    }
   
    async deleteLike<T extends Likeable>(entityId: string, userId: string, likeRecipient: LikeRecipient<T>){
        Promise.all([ this.likeRepository.stopLike(likeRecipient.collectionModel, entityId, userId),
                      this.likeRepository.decrementLike(likeRecipient.model, entityId)])
        .then(()=> {})
    }

    async deleteDislike<T extends Likeable>(entityId: string, userId: string, likeRecipient: LikeRecipient<T>){
        await Promise.all([ this.likeRepository.stopDislike(likeRecipient.collectionModel, entityId, userId),
                            this.likeRepository.decrementDislike(likeRecipient.model, entityId)])
    }

    async addLike<T extends Likeable>(entityId: string, userId: string, likeRecipient: LikeRecipient<T>){
        Promise.all([ this.likeRepository.addLike(likeRecipient.collectionModel, entityId, userId),
                      this.likeRepository.incrementLike(likeRecipient.model, entityId)])
                .then(()=>{})


    }
    async addDislike<T extends Likeable>(entityId: string, userId: string, likeRecipient: LikeRecipient<T>){                
        await Promise.all([ this.likeRepository.addDislike(likeRecipient.collectionModel, entityId, userId),
                            this.likeRepository.incrementDisLike(likeRecipient.model, entityId)])
    }

    async clear() {
        await this.likeRepository.clear()
    }
}