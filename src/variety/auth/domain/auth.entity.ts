import mongoose, { HydratedDocument, Model, model } from "mongoose";
import * as SETTING from "../../../setting"
import { userSchema, UserType } from "../../users/domain/user.entity";

type confirmEmailType = {
    code: string,
    expirationTime: Date,
    countSendingCode: number
}

export type AuthUserType = {
    user: UserType,
    confirmEmail: confirmEmailType
}
const confirmEmailSchema = new mongoose.Schema<confirmEmailType>( {
    code: { type: String, required: true },
    expirationTime: { type: Date, required: true },
    countSendingCode: { type: Number, required: true, min: 0 }
})


type AuthModel = Model<AuthUserType>
export type AuthDocument = HydratedDocument<AuthUserType>

const authSchema = new mongoose.Schema<AuthUserType>({
    user:	        { type: userSchema, required: true },
    confirmEmail:	{ type: confirmEmailSchema, required: true },
 });
  
  export const AuthModel = model<AuthUserType, AuthModel>(SETTING.USER_UNCONFIRMED_COLLECTION_NAME, authSchema);