import { ObjectId } from "mongoose";
import mongoose, { Schema } from "mongoose";

export type LastLikesType = {
    addedAt:  Date,
    userId:   ObjectId,
    login:    string
  }

export const LastLikesSchema = new mongoose.Schema<LastLikesType>({
    addedAt:  { type: Date, required: true},
    userId:   { type: Schema.Types.ObjectId, required: true},
    login:    { type: String, required: true}
  })


export type LikesCommentType = {
    likes:      number;
    dislikes:   number;
    incLikes(): Promise<void>;
    incDislikes():  Promise<void>;
    decLikes():     Promise<void>;
    decDislikes():  Promise<void>;
}
