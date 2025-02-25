import { ObjectId } from "mongoose";
import mongoose, {HydratedDocument, Model, model, Schema } from "mongoose";
import { LIKE_COMMENT_COLLECTION_NAME, LIKE_POST_COLLECTION_NAME, POST_COLLECTION_NAME } from "../../../setting/setting.path.name";
import { Rating } from "../types";

export interface LikeType {
        active:     boolean;
        createdAt:  Date;
        targetId:   string;
        ownerId:    string;
        rating:     Rating
}

export const likeSchema = new mongoose.Schema<LikeType>({
    active: { 
            type:       Boolean, 
            default:    true },
    createdAt: { 
            type:       Date, 
            required:   true },
    targetId: {
            type:       String,
            required:   true },
    ownerId: {
            type:       String,
            required:   true },
    rating: {
            type:       String,
            enum:       Rating,
            required:   true
    }    
})

export type LikeModelType = Model<LikeType>
export type LikeDocument = HydratedDocument<LikeType>

export const LikeCommentModel = model<LikeType, LikeModelType>(LIKE_COMMENT_COLLECTION_NAME, likeSchema);
export const LikePostModel = model<LikeType, LikeModelType>(LIKE_POST_COLLECTION_NAME, likeSchema);