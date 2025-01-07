import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { POST_COLLECTION_NAME } from "../../../setting/setting.path.name";

export type PostType = {
  title:	string,
  shortDescription: string,
  content: string,
  createdAt: Date,
  blogId:	string,
  blogName:	string
}

type PostModel = Model<PostType>
export type PostDocument = HydratedDocument<PostType>

const postSchema = new mongoose.Schema<PostType>({
        title:	{ type: String, required: true },
        shortDescription: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, required: true },
        blogId:	{ type: String, required: true },
        blogName:	{ type: String, required: true }
  });



  export const PostModel = model<PostType, PostModel>(POST_COLLECTION_NAME, postSchema);