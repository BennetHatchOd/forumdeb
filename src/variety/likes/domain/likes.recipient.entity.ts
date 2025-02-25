import mongoose from "mongoose";

export interface Likeable {
    likesInfo: {
        likesCount:         number;
        dislikesCount:      number;
     };
  }

export type LikesRecipientType = {
    likesCount:         number;
    dislikesCount:      number;
}

export const likesRecipientSchema = new mongoose.Schema<LikesRecipientType>({
      likesCount: { type:       Number, 
                    min:        0,
                    default:    0,
                    validate:   {
                        validator: Number.isInteger, 
                        message: "Value should be integer",}
                    },
      dislikesCount: {type:   Number, 
                      min:      0,
                      default:  0,
                      validate: {
                        validator: Number.isInteger, 
                        message: "Value should be integer",}
                    },
})
