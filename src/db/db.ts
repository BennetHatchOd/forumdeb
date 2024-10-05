import { MongoClient, Collection, Db } from "mongodb";
import * as SETTING from "../setting";
import { BlogDBModel, CommentDBModel, PostDBModel, UserDBModel } from "./dbTypes";

const client: MongoClient = new MongoClient(SETTING.mongoURI)
export const db: Db = client.db(SETTING.DB_NAME);
 
export const blogCollection: Collection<BlogDBModel> = db.collection<BlogDBModel>(SETTING.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBModel> = db.collection<PostDBModel>(SETTING.POST_COLLECTION_NAME)
export const userCollection: Collection<UserDBModel> = db.collection<UserDBModel>(SETTING.USER_COLLECTION_NAME)
export const commentCollection: Collection<CommentDBModel> = db.collection<CommentDBModel>(SETTING.COMMENT_COLLECTION_NAME)
 

export const connectToDb = async (): Promise<boolean> => {
    try {
        await client.connect()
        console.log('connected to db successful')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}



