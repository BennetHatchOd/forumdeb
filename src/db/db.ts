import { MongoClient, Collection, Db } from "mongodb";
import * as SETTING from "../setting";
import { activeSessionDB, BlogDBModel, CommentDBModel, PostDBModel, requestAPIModelDB, UserDBModel, UserUnconfirmedDBModel } from "./dbTypes";

const client: MongoClient = new MongoClient(SETTING.mongoURI)
export const db: Db = client.db(SETTING.DB_NAME);
 
export const blogCollection: Collection<BlogDBModel> = db.collection<BlogDBModel>(SETTING.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBModel> = db.collection<PostDBModel>(SETTING.POST_COLLECTION_NAME)
export const userCollection: Collection<UserDBModel> = db.collection<UserDBModel>(SETTING.USER_COLLECTION_NAME)
export const authUserCollection: Collection<UserUnconfirmedDBModel> = db.collection<UserUnconfirmedDBModel>(SETTING.USER_UNCONFIRMED_COLLECTION_NAME)
export const commentCollection: Collection<CommentDBModel> = db.collection<CommentDBModel>(SETTING.COMMENT_COLLECTION_NAME)
// export const tokenCollection: Collection<TokenListDB> = db.collection<TokenListDB>(SETTING.TOKEN_COLLECTION_NAME)
export const requestCollection: Collection<requestAPIModelDB> = db.collection<requestAPIModelDB>(SETTING.REQUEST_COLLECTION_NAME)
export const sessionCollection: Collection<activeSessionDB> = db.collection<activeSessionDB>(SETTING.SESSION_COLLECTION_NAME)
 

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



