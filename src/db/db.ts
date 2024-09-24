import { MongoClient, Collection, Db } from "mongodb";
import * as SETTING from "../setting";
import { BlogDBType, PostDBType, UserDBType } from "./dbTypes";

const client: MongoClient = new MongoClient(SETTING.mongoURI)
export const db: Db = client.db(SETTING.DB_NAME);
 
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTING.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTING.POST_COLLECTION_NAME)
export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTING.USER_COLLECTION_NAME)
 

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



