import { PostViewModel, PostInputModel } from "../../types";
import { postRepository } from "./repositories/postRepository";
import { blogRepository } from "../blogs/repositories/blogRepository";
import { blogQueryRepository } from "../blogs/repositories/blogQueryRepository";

export const postService = {
 
    async create(createItem: PostInputModel): Promise <string | null>{ // creates new post and returns this post 

        try{
            if(!blogRepository.isExist(createItem.blogId))
                throw `blog with ID: ${createItem.blogId} doesn't exist`;
            const parentName:  string | null  = await blogQueryRepository.findNameById(createItem.blogId); 
            if(!parentName)
                return null;
            const newPost: PostViewModel = {
                            ...createItem, 
                            id: '',
                            blogName: parentName,
                            createdAt: new Date().toISOString(),
                        }
            return await postRepository.create(newPost)
        } 
        catch (err){
            console.log(err)
            return null;
        }    
        
    },
    
       async edit(id: string, editData: PostInputModel): Promise <boolean> {// edits a post by ID, if the post is not found returns false   
           
           try{
                if (! await postRepository.isExist(id))
                    throw 'post with ID: ${id} don\' exist';
               if(! await blogRepository.isExist(editData.blogId))
                   throw ` blogIdD: ${editData.blogId} isn\'t correct`;
               
               const parentName: string | null = 
                       await blogQueryRepository.findNameById(editData.blogId); 
               if( !parentName)
                    return false;               

               return await postRepository.edit(id, editData, {blogName: parentName});
           } 
           catch (err){
               console.log(err)
               return false;
           }
       },
    
    async delete(id: string): Promise < boolean > { // deletes a post by Id, returns true if the post existed
        try{
            if (! await postRepository.isExist(id))
                return false;    

            return await postRepository.delete(id);
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },
   

    async clear(): Promise < boolean > {// deletes all posts from base
         
        return await postRepository.clear()
    },
}