import { CodStatus, StatusResult } from "../../../types/types";
import { BlogType } from "../domain/blog.entity";
import { BlogRepository } from "../repositories/blog.repository";
import { BlogInputType, BlogViewType } from "../types";

export class BlogService {

    constructor(private blogRepository: BlogRepository){}

    async create(createItem: BlogInputType): Promise < StatusResult<string|undefined>>{ 

        const newBlog: BlogType = {
                                ...createItem, 
                                createdAt: new Date(),
                                isMembership: false,                                   
                            }
        return await this.blogRepository.create(newBlog)

    }
 
    async edit(id: string, editData: BlogInputType): Promise < StatusResult >{    
        const existResult: StatusResult = await this.blogRepository.isExist(id)
        
        if (existResult.codResult != CodStatus.Ok )
            return existResult;

        return await this.blogRepository.edit(id, editData);         
    }

   async delete(id: string): Promise < StatusResult > {     
        const existResult: StatusResult = await this.blogRepository.isExist(id)

        if (existResult.codResult != CodStatus.Ok )
            return existResult;

        return await this.blogRepository.delete(id);
    }

    async clear(): Promise < StatusResult > {
        return await this.blogRepository.clear()
    }
}