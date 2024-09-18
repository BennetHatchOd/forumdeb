import { PostViewModel, PostInputModel, BlogViewModel } from "../../../types";
import { PostDBType } from "../../../db/dbTypes";
import { postCollection } from "../../../db/db";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";

export const postRepository = {
 
    async isExist(id: string): Promise < boolean > { // searches for a post by id and returns the post or null
        try{
            if(!ObjectId.isValid(id))
                return false;        
            const exist: number = await postCollection.countDocuments({_id: new ObjectId(id)})
            
             return exist > 0 ? true : false;
        } 
        catch (err){      
            console.log(err)
            throw(err);
        }

    },
                 
    async create(createItem: PostViewModel): Promise <string | null>{ // creates new post and returns this post 
        try{
            const answerInsert: InsertOneResult = await postCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.insertedId ? answerInsert.insertedId.toString() : null;
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },
     
    async edit(id: string, editData: PostInputModel, addData = {}): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    
        try{
            if(!ObjectId.isValid(id))
                return false;   
            const answerUpdate = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {...editData, ...addData}});
            return answerUpdate.matchedCount != 0 ? true : false; 
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },
    
    async delete(id: string): Promise < boolean > { // deletes a post by Id, returns true if the post existed
        try{
            if(!ObjectId.isValid(id))
                return false;
            const answerDelete: DeleteResult = await postCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount != 0 ? true : false;
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },
   
    async clear(): Promise < boolean > {// deletes all posts from base
        try{
            await postCollection.deleteMany()
            return await postCollection.countDocuments({}) == 0 ? true : false;
        } catch(err){
            console.log(err)
            throw(err);
        }
    },

    mapViewToDb(item: PostViewModel): PostDBType {
        const _id: ObjectId = ObjectId.isValid(item.id) ? new ObjectId(item.id) : new ObjectId;    

        return { 
            _id: _id,
            title: item.title,
            shortDescription: item.shortDescription,
            createdAt: item.createdAt,
            blogId: item.blogId,
            blogName: item.blogName,
            content: item.content
            }
                   
        }
}