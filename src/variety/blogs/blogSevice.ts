import { CodStatus, StatusResult } from "../../interfaces";
import { BlogViewModel, BlogInputModel } from "../../types";
import { blogRepository } from "./repositories/blogRepository"; 

export const blogService = {

    async create(createItem: BlogInputModel): Promise < StatusResult<string|undefined>>{ 

        const newBlog: Omit<BlogViewModel, 'id'> = {
                                ...createItem, 
                                createdAt: new Date().toISOString(),
                                isMembership: false,                                   
                            }
        return await blogRepository.create(newBlog)

    },
 
    async edit(id: string, editData: BlogInputModel): Promise < StatusResult >{    
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