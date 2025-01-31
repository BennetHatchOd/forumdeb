import mongoose from "mongoose";

export interface Likeable {
    likesInfo: {
        likesCount:         number;
        dislikesCount:      number;
    //     incrementLikes: () => void;
    //     incrementDislikes: () => void;
    //     decrementLikes: () => void;
    //     decrementDislikes: () => void;
     };
  }

export type LikesRecipientType = {
    likesCount:         number;
    dislikesCount:      number;
    // incrementLikes():   void;
    // incrementDislikes():void;
    // decrementLikes():   void;
    // decrementDislikes():void;
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

// likesRecipientSchema.methods.incrementLikes = function(): void{
//     this.likesCount++
// }
// likesRecipientSchema.methods.incrementDislikes = function(): void{
//     this.dislikesCount++
// }
// likesRecipientSchema.methods.decrementLikes =  function(): void{
//     if(this.likesCount == 0)
//         throw "likes shouldn't be negative"
//     this.likesCount--
// }
// likesRecipientSchema.methods.decrementDislikes = function(): void{
//     if(this.dislikesCount == 0)
//         throw "likes shouldn't be negative"
//     this.dislikesCount--
// }

// export const LikesRecipientModel = mongoose.model('LikesRecipient', likesRecipientSchema);