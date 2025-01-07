import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { BLOG_COLLECTION_NAME } from "../../../setting/setting.path.name";

export type BlogType = {
    name:   string,
    description: string,
    createdAt: Date,
    isMembership: boolean,
    websiteUrl:	string
}

type BlogModel = Model<BlogType>
export type BlogDocument = HydratedDocument<BlogType>

const blogSchema = new mongoose.Schema<BlogType>({
    name:	{ type: String, required: true },
    description:	{ type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt:	{ type: Date, required: true },
    isMembership:	{ type: Boolean, required: true },
  });
  
  export const BlogModel = model<BlogType, BlogModel>(BLOG_COLLECTION_NAME, blogSchema);