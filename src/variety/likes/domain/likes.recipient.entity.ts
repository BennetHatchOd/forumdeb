import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Rating } from "../types";

export interface Likeable {
    likesInfo: {
        incrementLikes: () => Promise<void>;
        incrementDislikes: () => Promise<void>;
        decrementLikes: () => Promise<void>;
        decrementDislikes: () => Promise<void>;
    };
  }

export type LikesRecipientType = {
    likes: number;
    dislikes: number;
    incrementLikes():Promise<void>;
    incrementDislikes():Promise<void>;
    decrementLikes():Promise<void>;
    decrementDislikes():Promise<void>;
}

export const likesRecipientSchema = new mongoose.Schema<LikesRecipientType>({
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
likesRecipientSchema.methods.incrementLikes = async function(): Promise<void>{
    this.likes++
}
likesRecipientSchema.methods.incrementDislikes = async function(): Promise<void>{
    this.dislikes++
}
likesRecipientSchema.methods.decrementLikes = async function(): Promise<void>{
    if(this.likes == 0)
        throw "likes shouldn't be negative"
    this.likes--
}
likesRecipientSchema.methods.decrementDislikes = async function(): Promise<void>{
    if(this.dislikes == 0)
        throw "likes shouldn't be negative"
    this.dislikes--
}
