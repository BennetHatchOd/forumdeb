import { ObjectId } from "mongodb";
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
//lastLikes:  LastLikesType;

// export const likesCommentSchema = new mongoose.Schema<LikesCommentType>({
//       likes: { type:      Number, 
//                min: 0,
//                default: 0,
//                validate: {
//                   validator: Number.isInteger, 
//                   message: "Value should be integer",}
//               },
//       dislikes: { type:   Number, 
//                 min:      0,
//                 default: 0,
//                 validate: {
//                   validator: Number.isInteger, 
//                   message: "Value should be integer",}
//               },
//     lastLikes: {type: LastLikesSchema, required: true }       
// })
// likesCommentSchema.methods.incLikes = async function(): Promise<void>{
//     this.likes++
// }
// likesCommentSchema.methods.incDislikes = async function(): Promise<void>{
//     this.dislikes++
// }
// likesCommentSchema.methods.decLikes = async function(): Promise<void>{
//     if(this.likes == 0)
//         throw "likes shouldn't be negative"
//     this.likes--
// }
// likesCommentSchema.methods.decDislikes = async function(): Promise<void>{
//     if(this.dislikes == 0)
//         throw "likes shouldn't be negative"
//     this.dislikes--
// }
