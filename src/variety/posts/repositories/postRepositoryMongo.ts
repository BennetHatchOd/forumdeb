import { PostViewModel, PostInputModel, BlogViewModel } from "../../../types";
import { blogRepository } from "../../blogs/repositories/index";
import { PostDBType } from "../../../db/dbTypes";
import { postCollection } from "../../../db/db";
import { ObjectId } from "mongodb";

export const postRepositoryMongo = {
 
    async find(id: string): Promise < PostViewModel | null > { // searches for a post by id and returns the post or null
        if(!ObjectId.isValid(id))
            return null;
        try{
            const searchItem: PostDBType | null = await postCollection.findOne({_id: new ObjectId(id)})
            
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
            const parentBlog:  BlogViewModel | null  = await blogRepository.find(createItem.blogId); 
            if(!parentBlog)
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
            blogName = parentBlog.name; 
        }
        catch(err){
            console.log(err);
            blogName = "blog  doesn't exist";
        }

        const newPost: PostDBType = {
                            ...createItem, 
                            _id: new ObjectId(),
                            blogName: blogName,
                            createdAt: new Date().toISOString(),
                        }
        try{                    
            await postCollection.insertOne(newPost);
            return this.mapDbToOutput(newPost);

        } 
        catch (err){
            console.log(err)
            return null;
        }    
        
    },

    
    async delete(id: string): Promise < boolean > { // deletes a post by Id, returns true if the post existed
        if(!ObjectId.isValid(id))
            return false;
        try{
            const answerDelete = await postCollection.deleteOne({_id: new ObjectId(id)})

            if(answerDelete.deletedCount == 0)    
                return false;
            else
                return true;
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },
   
 
    async edit(id: string, correctPost: PostInputModel): Promise <boolean> {// edits a post by ID, if the post is not found returns false   
        
        let blogName: string;
        try{
            if(!ObjectId.isValid(correctPost.blogId))
                throw `blog with ID: ${correctPost.blogId} doesn't exist`;
            const parentBlog:  BlogViewModel | null  = await blogRepository.find(correctPost.blogId); 
            if(!parentBlog)
                throw `blog with ID: ${correctPost.blogId} doesn't exist`;
            blogName = parentBlog.name; 
        }
        catch(err){
            console.log(err);
            blogName = "blog  doesn't exist";
        }
        if(!ObjectId.isValid(id))
            return false;
 
        try{
            const updatePost: PostDBType | null = await postCollection.findOne({_id: new ObjectId(id)})
            
            if(updatePost){
                const outPost: PostDBType = {...updatePost, ...correctPost, blogName: blogName}
                const result = await postCollection.replaceOne({_id: outPost._id}, outPost);
                return (result.modifiedCount == 1? true: false);
            } else
                return false;
                
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    async clear(): Promise < boolean > {// deletes all posts from base
        try{
            await postCollection.deleteMany()
            return true;
        } 
        catch(err){
            console.log(err)
            return false;
        }
    },

 
    async view(): Promise <PostViewModel[]> { // returns list of all posts 
        try{
            const index = postCollection.find();

            const posts: Array<PostViewModel> = (await index.toArray()).map(s => this.mapDbToOutput(s));
            return posts;
        } 
        catch (err){
            console.log(err)
            return [];
        }
    },
    mapDbToOutput(item: PostDBType): PostViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}