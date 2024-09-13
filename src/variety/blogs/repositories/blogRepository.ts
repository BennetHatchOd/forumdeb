import { BlogViewModel, BlogInputModel } from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";

export const blogRepository = {

 
    async findById(_id: ObjectId): Promise < BlogViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        try{
                    
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: _id})
            
            if(searchItem) 
                return this.mapDbToOutput(searchItem);
            else
                return null;

        } catch (err){      
            console.log(err)
            return null;
        }

    },
 
   
    async create(createItem: BlogDBType): Promise < boolean>{     // creates new blog and returns this blog 

        try{                    
            await blogCollection.insertOne(createItem);
            return true;

        } catch (err){
            console.log(err)
            return false;
        }
    },



    async delete(id: ObjectId): Promise < boolean > {     // deletes a blog by Id, returns true if the blog existed    

        try{
            
            const answerDelete = await blogCollection.deleteOne({_id: id})

            if(answerDelete.deletedCount == 0)    
                return false;
            else
                return true;
        } catch (err){
            console.log(err)
            return false;
        }
    },

    async edit(correctItem: BlogDBType): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    

        try{
            await blogCollection.replaceOne({_id: correctItem._id}, correctItem);
                return true; 
        } catch (err){
            console.log(err)
            return false;
        }
    },

    async clear(): Promise < boolean > {// deletes all blogs from base
        try{
            await blogCollection.deleteMany()
            return true;
        } catch(err){
            console.log(err)
            return false;
        }
    },

    
    // async view(): Promise < BlogViewModel[] > {     // returns list of all blogs        
    //     try{
    //         const index = blogCollection.find();

    //         const blogs: Array<BlogViewModel> = (await index.toArray()).map(s => this.mapDbToOutput(s));
    //         return blogs;
    //     } catch (err){
    //         console.log(err)
    //         return [];
    //     }
    // },

    mapDbToOutput(item: BlogDBType): BlogViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
