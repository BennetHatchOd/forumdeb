import { postRepository } from "./repositories/postRepository";
import { blogRepository } from "../blogs/repositories/blogRepository";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { PostInputType, PostViewType } from "./types";
import { PostDBType } from "../../db/dbTypes";

export const postService = {
 
    async create(createItem: PostInputType): Promise <StatusResult<string|undefined>>{
        const checkParentBlog = await blogRepository.isExist(createItem.blogId)
        
        if(checkParentBlog.codResult != CodStatus.Ok)
            return checkParentBlog;
        const parentBlog = await blogRepository.findById(createItem.blogId)
        if(!parentBlog.data)
            return parentBlog as StatusResult;
        const newPost: PostDBType = {
                        ...createItem, 
                        blogName: parentBlog.data.name,
                        createdAt: new Date(),
                    }
        return await postRepository.create(newPost)
    },
    
    async edit(id: string, editData: PostInputType): Promise <StatusResult> {   

        const existResult: StatusResult = await postRepository.isExist(id)
        if (existResult.codResult != CodStatus.Ok )
            return existResult;
                    
        const checkParentBlog = await blogRepository.isExist(editData.blogId)
        if(checkParentBlog.codResult != CodStatus.Ok)
            return {codResult: CodStatus.BadRequest};

        const parentBlog = await blogRepository.findById(editData.blogId); 
        if(!parentBlog.data)
            return {codResult: CodStatus.Error, message: 'can\'t get blogName'};
        
            return await postRepository.edit(id, editData, {blogName: parentBlog.data.name});
       },
    
       async delete(id: string): Promise<StatusResult > {     
            const existResult: StatusResult = await postRepository.isExist(id)

            if (existResult.codResult != CodStatus.Ok )
                return existResult;

            return await postRepository.delete(id);
    },
   
    async clear(): Promise<StatusResult> {
        return await postRepository.clear()
    },
}