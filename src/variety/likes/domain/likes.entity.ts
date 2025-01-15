import { ObjectId } from "mongodb";
import mongoose, {Schema } from "mongoose";

export type LikesType = {
    active: boolean;
    createdat: Date;
    targetId: ObjectId
}

export const likesSchema = new mongoose.Schema<LikesType>({
    active: { 
            type:       Boolean, 
            default:    true },
    createdat: { 
            type:       Date, 
            required:   true },
    targetId: {
            type:       Schema.Types.ObjectId,
            required:   true },
    })
