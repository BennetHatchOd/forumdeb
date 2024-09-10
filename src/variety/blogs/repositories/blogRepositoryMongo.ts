import { BlogViewModel, BlogInputModel } from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";

export const blogRepositoryMongo = {

 
    async find(id: string): Promise < BlogViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        try{
            if(!ObjectId.isValid(id))
                throw("ID is incorrect");
        
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})
            
            if(searchItem) 
                return this.mapDbToOutput(searchItem);
            else
                return null;

        } catch (err){      
            console.log(err)
            return null;
        }

    },
 
   
    async create(createItem: BlogInputModel): Promise < BlogViewModel | null>{     // creates new blog and returns this blog 

        try{            
            const newBlog: BlogDBType = {
                                    ...createItem, 
                                    _id: new ObjectId(),
                                    createdAt: new Date().toISOString(),
                                    isMembership: false,                                   
                                }
            
            await blogCollection.insertOne(newBlog);
            return this.mapDbToOutput(newBlog);

        } catch (err){
            console.log(err)
            return null;
        }
    },



    async delete(id: string): Promise < boolean > {     // deletes a blog by Id, returns true if the blog existed    

        try{
            if(!ObjectId.isValid(id))
                throw("ID is incorrect");

            const answerDelete = await blogCollection.deleteOne({_id: new ObjectId(id)})

            if(answerDelete.deletedCount == 0)    
                return false;
            else
                return true;
        } catch (err){
            console.log(err)
            return false;
        }
    },

    async edit(id: string, correctItem: BlogInputModel): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    

        try{
            if(!ObjectId.isValid(id))
                throw("ID is incorrect");
            const updateBlog: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})
            
            if(updateBlog){
                const outBlog: BlogDBType = {...updateBlog, ...correctItem}
                await blogCollection.replaceOne({_id: outBlog._id}, outBlog);
                return true;
            } else
                return false;
                
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

    
    async view(): Promise < BlogViewModel[] > {     // returns list of all blogs        
        try{
            const index = blogCollection.find();

            const blogs: Array<BlogViewModel> = (await index.toArray()).map(s => this.mapDbToOutput(s));
            return blogs;
        } catch (err){
            console.log(err)
            return [];
        }
    },

    mapDbToOutput(item: BlogDBType): BlogViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
