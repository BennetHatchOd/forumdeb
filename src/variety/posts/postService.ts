import { PostViewModel, PostInputModel, BlogViewModel } from "../../types";
import { PostDBType } from "../../db/dbTypes";
import { postCollection } from "../../db/db";
import { ObjectId } from "mongodb";
import { postRepository } from "./repositories/postRepository";
import { blogRepository } from "../blogs/repositories/blogRepository";

export const postService = {
 
    async findById(id: string): Promise < PostViewModel | null > { // searches for a post by id and returns the post or null

        try{
            if(!ObjectId.isValid(id))
                throw("ID is incorrect");
            return await postRepository.findById(new ObjectId(id))
        } 
        catch (err){      
            console.log(err)
            return null;
        }

    },

    async create(createItem: PostInputModel): Promise <PostViewModel | null>{ // creates new post and returns this post 

        let parentName: string;
        try{
            if(!ObjectId.isValid(createItem.blogId))
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
            const parentBlog:  BlogViewModel | null  = await blogRepository.findById(new ObjectId(createItem.blogId)); 
            if(parentBlog)
                parentName = parentBlog.name
            else
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
        }
        catch(err){
            console.log(err);
            return null;
        }

        const newPost: PostDBType = {
                            ...createItem, 
                            _id: new ObjectId(),
                            blogName: parentName,
                            createdAt: new Date().toISOString(),
                        }
        try{                    
            if(await postRepository.create(newPost))
                return await postRepository.findById(newPost._id);
            return null;
        } 
        catch (err){
            console.log(err)
            return null;
        }    
        
    },
    
    async delete(id: string): Promise < boolean > { // deletes a post by Id, returns true if the post existed
        
        try{
            if(!ObjectId.isValid(id))
                throw "post.Id is incorrect";
            return await postRepository.delete(new ObjectId(id)) ? true : false;
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },
   
 
    async edit(id: string, correctPost: PostInputModel): Promise <boolean> {// edits a post by ID, if the post is not found returns false   
        
        let blogName: string;
        try{
            if( !ObjectId.isValid(id) || !ObjectId.isValid(correctPost.blogId))
                throw `post with ID: ${id} or blogIdD: ${correctPost.blogId} aren\'t correct`;
            
            const parentBlog:  BlogViewModel | null = 
                    await blogRepository.findById(new ObjectId(correctPost.blogId)); 
            const updatingPost: PostDBType | null = await postCollection.findOne({_id: new ObjectId(id)})
            
            if( !parentBlog || !updatingPost )
                throw `post with ID ${id} or blog ${correctPost.blogId} don't exist`;
            
            blogName = parentBlog.name; 
            const outPost: PostDBType = {...updatingPost, ...correctPost, blogName: blogName}
            return await postRepository.edit(outPost);
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    async clear(): Promise < boolean > {// deletes all posts from base
            return await postRepository.clear()
    },

 
    // async view(): Promise <PostViewModel[]> { // returns list of all posts 
    //     try{
    //         const index = postCollection.find();

    //         const posts: Array<PostViewModel> = (await index.toArray()).map(s => this.mapDbToOutput(s));
    //         return posts;
    //     } 
    //     catch (err){
    //         console.log(err)
    //         return [];
    //     }
    // // },
    // mapDbToOutput(item: PostDBType): PostViewModel {
        
    //     const {_id, ...rest} = item
    //     return {...rest,   id: _id.toString()}       
    // }
 
}