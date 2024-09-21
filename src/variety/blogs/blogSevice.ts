import { CodStatus, StatusResult } from "../../interfaces";
import { catchErr } from "../../modules/catchErr";
import { BlogViewModel, BlogInputModel } from "../../types";
import { blogRepository } from "./repositories/blogRepository"; 

export const blogService = {

    async create(createItem: BlogInputModel): Promise < StatusResult<string|null>>{ 

        try{            
            const newBlog: BlogViewModel = {
                                    ...createItem, 
                                    id: '',
                                    createdAt: new Date().toISOString(),
                                    isMembership: false,                                   
                                }
            return await blogRepository.create(newBlog)
        } 
        catch (err){
            return catchErr(err);
        }
    },
 
    async edit(id: string, editData: BlogInputModel): Promise < StatusResult >{    
        try{           
            const existResult: StatusResult = await blogRepository.isExist(id)
            
            if (existResult.codResult != CodStatus.Ok )
                return existResult;

            return await blogRepository.edit(id, editData);         
        } 
        catch (err){
            return catchErr(err);
        }
    },

   async delete(id: string): Promise < StatusResult > {     
        try{
            const existResult: StatusResult = await blogRepository.isExist(id)

            if (existResult.codResult != CodStatus.Ok )
                return existResult;

            return await blogRepository.delete(id);
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async clear(): Promise < StatusResult > {
        try{    
            return await blogRepository.clear()
        } 
        catch (err){
            return catchErr(err);
        }
    },
}