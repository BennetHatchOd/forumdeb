import { BlogDBType } from "../../../db/db.types";
import { blogRepository } from "../repositories/blog.repository"; 
import { BlogInputType, BlogViewType } from "../types";

export const blogService = {

    async create(createItem: BlogInputType): Promise < StatusResult<string|undefined>>{ 

        const newBlog: BlogDBType = {
                                ...createItem, 
                                createdAt: new Date(),
                                isMembership: false,                                   
                            }
        return await blogRepository.create(newBlog)

    },
 
    async edit(id: string, editData: BlogInputType): Promise < StatusResult >{    
        const existResult: StatusResult = await blogRepository.isExist(id)
        
        if (existResult.codResult != CodStatus.Ok )
            return existResult;

        return await blogRepository.edit(id, editData);         
    },

   async delete(id: string): Promise < StatusResult > {     
        const existResult: StatusResult = await blogRepository.isExist(id)

        if (existResult.codResult != CodStatus.Ok )
            return existResult;

        return await blogRepository.delete(id);
    },

    async clear(): Promise < StatusResult > {
        return await blogRepository.clear()
    },
}