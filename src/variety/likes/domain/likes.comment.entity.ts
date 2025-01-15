import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model, model } from "mongoose";

export type LikesCommentType = {
    likes: number;
    dislikes: number;
    incLikes():Promise<void>;
    incDislikes():Promise<void>;
    decLikes():Promise<void>;
    decDislikes():Promise<void>;
}

export const likesCommentSchema = new mongoose.Schema<LikesCommentType>({
      likes: { type:      Number, 
               min: 0,
               default: 0,
               validate: {
                  validator: Number.isInteger, 
                  message: "Value should be integer",}
              },
      dislikes: { type:   Number, 
                min:      0,
                default: 0,
                validate: {
                  validator: Number.isInteger, 
                  message: "Value should be integer",}
              },
})

likesCommentSchema.methods.incLikes = async function(): Promise<void>{
    this.likes++
    await this.save()
}
likesCommentSchema.methods.incDislikes = async function(): Promise<void>{
    this.likes++
    await this.save()
}
likesCommentSchema.methods.decLikes = async function(): Promise<void>{
    if(this.likes == 0)
        throw "likes shouldn't be negative"
    this.likes--
    await this.save()
}
likesCommentSchema.methods.decDislikes = async function(): Promise<void>{
    if(this.dislikes == 0)
        throw "likes shouldn't be negative"
    this.dislikes--
    await this.save()
}
