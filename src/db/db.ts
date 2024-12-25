import { MongoClient, Collection, Db } from "mongodb";
import mongoose from 'mongoose'
import * as SETTING from "../setting";
import { activeSessionDB, BlogDBType, CommentDBType, PostDBType, requestAPITypeDB, UserDBType, UserUnconfirmedDBType } from "./db.types";

// const client: MongoClient = new MongoClient(SETTING.mongoURI)
// export const db: Db = client.db(SETTING.DB_NAME);
 
// export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTING.BLOG_COLLECTION_NAME)
// export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTING.POST_COLLECTION_NAME)
// export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTING.USER_COLLECTION_NAME)
// export const authUserCollection: Collection<UserUnconfirmedDBType> = db.collection<UserUnconfirmedDBType>(SETTING.USER_UNCONFIRMED_COLLECTION_NAME)
// export const commentCollection: Collection<CommentDBType> = db.collection<CommentDBType>(SETTING.COMMENT_COLLECTION_NAME)
// export const requestCollection: Collection<requestAPITypeDB> = db.collection<requestAPITypeDB>(SETTING.REQUEST_COLLECTION_NAME)
// export const sessionCollection: Collection<activeSessionDB> = db.collection<activeSessionDB>(SETTING.SESSION_COLLECTION_NAME)
 

export const connectToDb = async (): Promise<boolean> => {
    try {
        await mongoose.connect(SETTING.mongoURI)
        console.log('connected to db successful')
        return true
    } catch (e) {
        console.log(e)
        await mongoose.disconnect()
        return false
    }
}



