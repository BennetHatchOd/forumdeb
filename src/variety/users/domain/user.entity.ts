import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { USER_COLLECTION_NAME } from "../../../setting/setting.path.name";
import { confirmEmailSchema, ConfirmEmailType } from "../../auth/domain/confirm.email.entity";

export type UserType = {
    login:	            string,
    email:	            string,
    password:           string,
    createdAt:	        Date, 
    isConfirmEmail?:    boolean,
    confirmEmail:       ConfirmEmailType 
}

type UserModel = Model<UserType>
export type UserDocument = HydratedDocument<UserType>

export const userSchema = new mongoose.Schema<UserType>({
    login:	        { type: String, required: true },
    email:	        { type: String, required: true },
    password:       { type: String, required: true },
    createdAt:	    { type: Date, required: true },
    isConfirmEmail: { type: Boolean, default: false},
    confirmEmail:   { type: confirmEmailSchema},
    //myCommentRating:{ type: myRatingSchema, default: () => ({ likes: [], dislikes: [] }) }
    // myPostRating:   { type: myRatingSchema, default: () => ({ likes: [], dislikes: [] }) }
  });
  
  export const UserModel = model<UserType, UserModel>(USER_COLLECTION_NAME, userSchema);