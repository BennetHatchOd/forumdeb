import { ObjectId } from "mongodb";
import mongoose, {Schema } from "mongoose";

export type LikesType = {
    active: boolean;
    createdAt: Date;
    targetId: ObjectId
}

export const likesSchema = new mongoose.Schema<LikesType>({
    active: { 
            type:       Boolean, 
            default:    true },
    createdAt: { 
            type:       Date, 
            required:   true },
    targetId: {
            type:       Schema.Types.ObjectId,
            required:   true },
    })
