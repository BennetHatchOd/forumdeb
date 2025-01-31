import mongoose, { HydratedDocument, model, Model, Schema } from "mongoose"
import { NEWPASSWORD_COLLECTION_NAME } from "../../../setting/setting.path.name"

export type newPasswordType = {
    userId: string,
    code: string,
    expirationTime: Date
}

type NewPasswordModel = Model<newPasswordType>
export type NewPasswordDocument = HydratedDocument<newPasswordType>

const newPasswordSchema = new mongoose.Schema<newPasswordType>({
    userId: {type: String, required: true},
    code: {type: String, required: true},
    expirationTime: {type: Date, required: true}
})

export const NewPasswordModel = model<newPasswordType, NewPasswordModel>(NEWPASSWORD_COLLECTION_NAME, newPasswordSchema);