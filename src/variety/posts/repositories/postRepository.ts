import { PostViewModel, PostInputModel, BlogViewModel } from "../../../types";
import { PostDBType } from "../../../db/dbTypes";
import { postCollection } from "../../../db/db";
import { DeleteResult, ObjectId } from "mongodb";
import { blogQueryRepository } from "../../blogs/repositories/blogQueryRepository";
import { blogRepository } from "../../blogs/repositories/blogRepository";

export const postRepository = {
 
    async findById(_id: ObjectId): Promise < PostViewModel | null > { // searches for a post by id and returns the post or null

        try{
            
            const searchItem: PostDBType | null = await postCollection.findOne({_id: _id})
            
            if(searchItem) 
                return this.mapDbToOutput(searchItem);
            else
                return null;

        } catch (err){      
            console.log(err)
            return null;
        }

    },
                 
    async create(createItem: PostInputModel): Promise <PostViewModel | null>{ // creates new post and returns this post 

        let blogName: string;
        try{
            if(!ObjectId.isValid(createItem.blogId))
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
            const parentBlog:  BlogViewModel | null  = await blogRepository.findById(new ObjectId(createItem.blogId)); 
            if(!parentBlog)
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
            blogName = parentBlog.name; 
        
      
            const newPost: PostDBType = {
                            ...createItem, 
                            _id: new ObjectId(),
                            blogName: blogName,
                            createdAt: new Date().toISOString(),
                        }                 
            await postCollection.insertOne(newPost);
            return this.mapDbToOutput(newPost);
        } 
        catch (err){
            console.log(err)
            return null;
        }    
        
    },

    
    async delete(_id: ObjectId): Promise < boolean > { // deletes a post by Id, returns true if the post existed
        try{
            const answerDelete: DeleteResult = await postCollection.deleteOne(_id)
            return answerDelete.deletedCount == 0 ? false : true;
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },
   
 
    async edit(correctPost: PostDBType): Promise <boolean> {// edits a post by ID, if the post is not found returns false   
        try{                   
            const result = await postCollection.replaceOne({_id: correctPost._id}, correctPost);
            return (result.modifiedCount == 1? true: false);
        }
        catch (err){
            console.log(err)
            return false;
        }
    },

    async clear(): Promise < boolean > {// deletes all posts from base
        try{
            const answerDelete: DeleteResult = await postCollection.deleteMany()
            return answerDelete.acknowledged;
        } 
        catch(err){
            console.log(err)
            return false;
        }
    },

    mapDbToOutput(item: PostDBType): PostViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}