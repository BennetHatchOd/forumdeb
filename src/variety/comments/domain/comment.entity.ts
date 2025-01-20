import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { COMMENT_COLLECTION_NAME } from "../../../setting/setting.path.name";
import { likesRecipientSchema, LikesRecipientType } from "../../likes/domain/likes.recipient.entity";

export type CommentatorInfoType ={
    userId:	    string,
    userLogin:  string	
}

export type CommentType = {
        parentPostId:     string,
        content:	        string,
        commentatorInfo:	CommentatorInfoType,
        createdAt:	      Date,
        likesInfo:        LikesRecipientType
    }

type CommentModel = Model<CommentType>
export type CommentDocument = HydratedDocument<CommentType>

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({
    userId:	    { type: String, required: true },
    userLogin:	{ type: String, required: true }
  });

const commentSchema = new mongoose.Schema<CommentType>({
    parentPostId:	    { type: String, required: true },
    content:	        { type: String, required: true },
    commentatorInfo:  { type: commentatorInfoSchema, required: true },
    likesInfo:        {type: likesRecipientSchema, required: true},
    createdAt:	      { type: Date, required: true },
  });
  
  export const CommentModel = model<CommentType, CommentModel>(COMMENT_COLLECTION_NAME, commentSchema);