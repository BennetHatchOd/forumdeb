import { PostRepository } from "../repositories/post.repository";
import { BlogRepository } from "../../blogs/repositories/blog.repository";
import { PostInputType } from "../types";
import { APIErrorResult, CodStatus, StatusResult } from "../../../types/types";
import { PostType } from "../domain/post.entity";

export class PostService {
 
    constructor(private postRepository: PostRepository,
                private blogRepository: BlogRepository){
    }

    async findBlogName(blogId: string): Promise<StatusResult<APIErrorResult|string>>{
        const checkParentBlog = await this.blogRepository.isExist(blogId)
        
        if(checkParentBlog.codResult != CodStatus.Ok)
            return {codResult: CodStatus.BadRequest, data: {errorsMessages: [{
                                                                message: "blogName isn't exist",
                                                                field: "blogId"
                                                            }]
                }};
        const parentBlog = await this.blogRepository.findById(blogId)
        if(!parentBlog.data)
            throw "can't get blogName";

        return {codResult: CodStatus.Ok, data: parentBlog.data.name}
    }
    
    async create(createItem: PostInputType): Promise <StatusResult<string|APIErrorResult>>{

        const checkParentBlog = await this.findBlogName(createItem.blogId)
        if(checkParentBlog.codResult == CodStatus.BadRequest) return checkParentBlog

        const newPost: PostType = {
                        ...createItem, 
                        blogName: checkParentBlog.data as string,
                        createdAt: new Date(),
                    }
        return await this.postRepository.create(newPost)
    }
    
    async edit(id: string, editData: PostInputType): Promise <StatusResult<APIErrorResult|{}>> {   

        const existResult: StatusResult = await this.postRepository.isExist(id)
        if (existResult.codResult != CodStatus.Ok )
            return {codResult: CodStatus.NotFound, data: {}};
                    
        const checkParentBlog = await this.findBlogName(editData.blogId)
        if(checkParentBlog.codResult == CodStatus.BadRequest) return checkParentBlog
        
        return await this.postRepository.edit(id, editData, {blogName: checkParentBlog.data as string});
    }
    
    async delete(id: string): Promise<StatusResult > {     
            return await this.postRepository.delete(id)
    }
   
    async clear(): Promise<StatusResult> {
        return await this.postRepository.clear()
    }
}