import mongoose, { HydratedDocument, Model, model } from "mongoose";
import * as SETTING from "../../../setting"

export type UserType = {
    login:	string,
    email:	string,
    password: string,
    createdAt:	Date
}

type UserModel = Model<UserType>
export type UserDocument = HydratedDocument<UserType>

export const userSchema = new mongoose.Schema<UserType>({
    login:	{ type: String, required: true },
    email:	{ type: String, required: true },
    password: { type: String, required: true },
    createdAt:	{ type: Date, required: true },
  });
  
  export const UserModel = model<UserType, UserModel>(SETTING.USER_COLLECTION_NAME, userSchema);