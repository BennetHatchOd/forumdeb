import mongoose from "mongoose";

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
