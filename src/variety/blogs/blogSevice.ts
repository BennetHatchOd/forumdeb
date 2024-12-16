import { BlogDBModel } from "../../db/dbTypes";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { blogRepository } from "./repositories/blogRepository"; 
import { BlogInputModel, BlogViewModel } from "./types";

export const blogService = {

    async create(createItem: BlogInputModel): Promise < StatusResult<string|undefined>>{ 

        const newBlog: BlogDBModel = {
                                ...createItem, 
                                createdAt: new Date(),
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