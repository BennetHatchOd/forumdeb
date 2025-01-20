import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { likesSchema, LikesType } from "./likes.entity";


export type MyRatingType = {
    likes:      Array<LikesType>;
    dislikes:   Array<LikesType>;

    hasLikes(   entity: ObjectId): boolean;
    hasDislikes(entity: ObjectId): boolean;
    
    addLikes(   entity: ObjectId):Promise<void>;
    addDislikes(entity: ObjectId):Promise<void>;
    
    stopLikes(  entity: ObjectId):Promise<void>;
    stopDislikes(entity: ObjectId):Promise<void>;
  }

export const myRatingSchema = new mongoose.Schema<MyRatingType>({
    likes:      {type: [likesSchema], required: true},
    dislikes:   {type: [likesSchema], required: true}
})

myRatingSchema.methods.hasLikes = function(entity: ObjectId): boolean{
    return this.likes.some((s: LikesType) => s.targetId.equals(entity) && s.active === true)
}

myRatingSchema.methods.hasDislikes = function(entity: ObjectId): boolean{
    return this.dislikes.some((s: LikesType) => s.targetId.equals(entity) && s.active === true)
}

myRatingSchema.methods.addLikes = async function(entity: ObjectId){
    const index = this.likes.findIndex((s: LikesType) => s.targetId.equals(entity))
    if(index !== -1){
        this.likes[index].active = true
    }else    
        this.likes.push({active:    true,
                        createdAt:  new Date(),
                        targetId:   entity})
}

myRatingSchema.methods.addDislikes = async function(entity: ObjectId){
    const index = this.dislikes.findIndex((s: LikesType) => s.targetId.equals(entity))
    if(index !== -1){
        this.dislikes[index].active = true
    }else    
        this.dislikes.push({active:    true,
                        createdAt:  new Date(),
                        targetId:   entity})
}

myRatingSchema.methods.stopLikes = async function(entity: ObjectId){
    const index = this.likes.findIndex((s: LikesType) => s.targetId.equals(entity))
    if(index !== -1){
        this.likes[index].active = false
    }else
        throw 'like not found'
}

myRatingSchema.methods.stopDislikes = async function(entity: ObjectId){
    const index = this.dislikes.findIndex((s: LikesType) => s.targetId.equals(entity))
    if(index !== -1){
        this.dislikes[index].active = false
    }else
        throw 'dislike not found'
}