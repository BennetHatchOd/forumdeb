import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { likesSchema, LikesType } from "./likes.entity";


export type MyCommentRatingType = {
    likes:      Array<LikesType>,
    dislikes:   Array<LikesType>
    hasLikes(comment: ObjectId): boolean;
    hasDislikes(comment: ObjectId): boolean;
    addLikes(comment: ObjectId):Promise<void>;
    addDislikes(comment: ObjectId):Promise<void>;
    stopLikes(comment: ObjectId):Promise<void>;
    stopDislikes(comment: ObjectId):Promise<void>;
  }

export const myCommentRatingSchema = new mongoose.Schema<MyCommentRatingType>({
    likes:      {type: [likesSchema], required: true},
    dislikes:   {type: [likesSchema], required: true}
})

myCommentRatingSchema.methods.hasLikes = function(comment: ObjectId): boolean{
    return this.likes.some((s: LikesType) => s.targetId.equals(comment) && s.active === true)
}

myCommentRatingSchema.methods.hasDislikes = function(comment: ObjectId): boolean{
    return this.dislikes.some((s: LikesType) => s.targetId.equals(comment) && s.active === true)
}

myCommentRatingSchema.methods.addLikes = async function(comment: ObjectId){
    const index = this.likes.findIndex((s: LikesType) => s.targetId.equals(comment))
    if(index !== -1){
        this.likes[index].active = true
    }else    
        this.likes.push({active:    true,
                        createdAt:  new Date(),
                        targetId:   comment})
}

myCommentRatingSchema.methods.addDislikes = async function(comment: ObjectId){
    const index = this.dislikes.findIndex((s: LikesType) => s.targetId.equals(comment))
    if(index !== -1){
        this.dislikes[index].active = true
    }else    
        this.dislikes.push({active:    true,
                        createdAt:  new Date(),
                        targetId:   comment})
}

myCommentRatingSchema.methods.stopLikes = async function(comment: ObjectId){
    const index = this.likes.findIndex((s: LikesType) => s.targetId.equals(comment))
    if(index !== -1){
        this.likes[index].active = false
    }else
        throw 'like not found'
    
}

myCommentRatingSchema.methods.stopDislikes = async function(comment: ObjectId){
    const index = this.dislikes.findIndex((s: LikesType) => s.targetId.equals(comment))
    if(index !== -1){
        this.dislikes[index].active = false
    }else
        throw 'dislike not found'
    
}