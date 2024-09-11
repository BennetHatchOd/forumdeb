import { BlogViewModel, BlogInputModel } from "../../types";
import { blogRepository } from "./repositories/blogRepository"; 
import { BlogDBType } from "../../db/dbTypes";
import { ObjectId } from "mongodb";

export const blogService = {

 
    async find(id: string): Promise < BlogViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        if(!ObjectId.isValid(id))
            return null;

        return await blogRepository.findById(new ObjectId(id))
            
    },
 
   
    async create(createItem: BlogInputModel): Promise < BlogViewModel | null>{     // creates new blog and returns this blog 

        try{            
            const newBlog: BlogDBType = {
                                    ...createItem, 
                                    _id: new ObjectId(),
                                    createdAt: new Date().toISOString(),
                                    isMembership: false,                                   
                                }
            
            if(await blogRepository.create(newBlog)){
                const returnBlog: BlogViewModel | null = await blogRepository.findById(newBlog._id)
                return returnBlog;
            }
            return null;

        } catch (err){
            console.log(err)
            return null;
        }
    },
 
    async edit(id: string, correctItem: BlogInputModel): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    

        try{
            if(!ObjectId.isValid(id))
                throw("ID is incorrect");
            const updateBlog: BlogViewModel | null = await blogRepository.findById(new ObjectId(id))
            
            if(updateBlog){
                const outBlog: BlogDBType = {...this.mapViewToDb(updateBlog), ...correctItem}
                await blogRepository.edit(outBlog);
                return true;
            } else
                return false;
                
        } catch (err){
            console.log(err)
            return false;
        }
    },

   async delete(id: string): Promise < boolean > {     // deletes a blog by Id, returns true if the blog existed    
        
        if(!ObjectId.isValid(id))
            return false;
        return await blogRepository.delete(new ObjectId(id));

    },

    async clear(): Promise < boolean > {// deletes all blogs from base
        
        return await blogRepository.clear()
    },

    
    async view(): Promise < BlogViewModel[] > {     // returns list of all blogs        
        try{
            const index = blogRepository.view();

            return index;
        } catch (err){
            console.log(err)
            return [];
        }
    },

    mapViewToDb(item: BlogViewModel): BlogDBType {
        
        const {id, ...rest} = item
        return {...rest,   _id: new ObjectId(id)}       
    }
 
}
