import mongoose from "mongoose";

// export type AuthUserType = {
//     user: UserType,
//     confirmEmail: confirmEmailType
// }

export type ConfirmEmailType = {
    code: string,
    expirationTime: Date,
    countSendingCode: number
}

export const confirmEmailSchema = new mongoose.Schema<ConfirmEmailType>( {
    code: { type: String, required: true },
    expirationTime: { type: Date, required: true },
    countSendingCode: { type: Number, required: true, min: 0 }
})


// type AuthModel = Model<AuthUserType>
// export type AuthDocument = HydratedDocument<AuthUserType>

// const authSchema = new mongoose.Schema<AuthUserType>({
//     user:	        { type: userSchema, required: true },
//     confirmEmail:	{ type: confirmEmailSchema, required: true },
//  });
  
// export const AuthModel = model<AuthUserType, AuthModel>(USER_UNCONFIRMED_COLLECTION_NAME, authSchema);