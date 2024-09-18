import { BlogViewModel, BlogInputModel } from "../../types";
import { blogRepository } from "./repositories/blogRepository"; 

export const blogService = {

 
    async create(createItem: BlogInputModel): Promise < string | null>{     // creates new blog and returns this blog 

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
            console.log(err)
            throw(err);
        }
    },
 
    async edit(id: string, editData: BlogInputModel): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    
        try{           
            if (! await blogRepository.isExist(id))
                return false;

            return await blogRepository.edit(id, editData);         
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },

   async delete(id: string): Promise < boolean > {     // deletes a blog by Id, returns true if the blog existed    
        try{
            if (! await blogRepository.isExist(id))
                return false;    

            return await blogRepository.delete(id);
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },

    async clear(): Promise < boolean > {// deletes all blogs from base
        try{    
            return await blogRepository.clear()
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },
