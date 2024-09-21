import { PostViewModel, PostInputModel } from "../../types";
import { postRepository } from "./repositories/postRepository";
import { blogRepository } from "../blogs/repositories/blogRepository";
import { catchErr } from "../../modules/catchErr";
import { CodStatus, StatusResult } from "../../interfaces";

export const postService = {
 
    async create(createItem: PostInputModel): Promise <StatusResult<string|null>>{

        try{
            const checkParentBlog = await blogRepository.isExist(createItem.blogId)
            
            if(checkParentBlog.codResult != CodStatus.Ok)
                return checkParentBlog;
            const parentName = await blogRepository.findNameById(createItem.blogId); 
            if(!parentName.data)
                return parentName;
            const newPost: PostViewModel = {
                            ...createItem, 
                            id: '',
                            blogName: parentName.data,
                            createdAt: new Date().toISOString(),
                        }
            return await postRepository.create(newPost)
        } 
        catch (err){
            return catchErr(err);
        }    
        
    },
    
    async edit(id: string, editData: PostInputModel): Promise <StatusResult> {   
        try{
            const existResult: StatusResult = await postRepository.isExist(id)
            if (existResult.codResult != CodStatus.Ok )
                return existResult;
                     
            const checkParentBlog = await blogRepository.isExist(editData.blogId)
            if(checkParentBlog.codResult != CodStatus.Ok)
                return checkParentBlog;
            const parentName = await blogRepository.findNameById(editData.blogId); 
            if(!parentName.data)
                return parentName as StatusResult;
            
               return await postRepository.edit(id, editData, {blogName: parentName});
           } 
           catch (err){
            return catchErr(err);
            }
       },
    
       async delete(id: string): Promise<StatusResult > {     
        try{
            const existResult: StatusResult = await postRepository.isExist(id)

            if (existResult.codResult != CodStatus.Ok )
                return existResult;

            return await postRepository.delete(id);
        } 
        catch (err){
            return catchErr(err);
        }
    },
   

    async clear(): Promise<StatusResult> {
        try{    
            return await postRepository.clear()
        } 
        catch (err){
            return catchErr(err);
        }
    },
}