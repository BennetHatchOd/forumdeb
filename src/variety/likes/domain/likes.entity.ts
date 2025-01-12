import mongoose, { HydratedDocument, Model, model } from "mongoose";

export type LikesCommentType = {
    likes: number,
    dislikes: number
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

export type MyCommentRatingType = {
    likes:      Array<string>,
    dislikes:   Array<string>
}

export const myCommentRatingSchema = new mongoose.Schema<MyCommentRatingType>({
    likes:      {type: [String], default: []},
    dislikes:   {type: [String], default: []}
})
