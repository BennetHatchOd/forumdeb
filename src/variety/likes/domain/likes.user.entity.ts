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
    likes:      {type: [likesSchema], default: []},
    dislikes:   {type: [likesSchema], default: []}
})

myCommentRatingSchema.methods.hasLikes = function(comment: ObjectId): boolean{
    return this.likes.some((s: LikesType) => s.targetId.equals(comment) && s.active === true)
}

myCommentRatingSchema.methods.hasDislikes = function(comment: ObjectId): boolean{
    return this.dislikes.some((s: LikesType) => s.targetId.equals(comment) && s.active === true)
}

myCommentRatingSchema.methods.addLikes = async function(comment: ObjectId){
    if(this.likes.some((s: LikesType) => s.targetId.equals(comment))){
        const index = this.likes.indexOf((s: LikesType) => s.targetId.equals(comment))
        this.likes[index].active = true
    }else    
        this.likes.push({active:    true,
                        createdat:  new Date(),
                        targetId:   comment})
    await this.save()
}

myCommentRatingSchema.methods.addDislikes = async function(comment: ObjectId){
    if(this.dislikes.some((s: LikesType) => s.targetId.equals(comment))){
        const index = this.dislikes.indexOf((s: LikesType) => s.targetId.equals(comment))
        this.dislikes[index].active = true
    }else    
        this.dislikes.push({active:    true,
                        createdat:  new Date(),
                        targetId:   comment})
    await this.save()
}

myCommentRatingSchema.methods.stopLikes = async function(comment: ObjectId){
    if(this.likes.some((s: LikesType) => s.targetId.equals(comment))){
        const index = this.likes.indexOf((s: LikesType) => s.targetId.equals(comment))
        this.likes[index].active = false
        await this.save()
    }else
        throw 'like not found'
    
}

myCommentRatingSchema.methods.stopDislikes = async function(comment: ObjectId){
    if(this.dislikes.some((s: LikesType) => s.targetId.equals(comment))){
        const index = this.dislikes.indexOf((s: LikesType) => s.targetId.equals(comment))
        this.dislikes[index].active = false
        await this.save()
    }else
        throw 'dislike not found'
    
}