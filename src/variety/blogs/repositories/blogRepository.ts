import { BlogViewModel, BlogInputModel } from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";

export const blogRepository = {

 
    async isExist(id: string): Promise < boolean > {      // searches for a blog by id and returns this blog or null
        
        try{
            if(!ObjectId.isValid(id))
                return false;        
            const exist: number = await blogCollection.countDocuments({_id: new ObjectId(id)})           
             return exist > 0 ? true : false;
        } 
        catch (err){      
            console.log(err)
            return false;
        }
    },
 
   
    async create(createItem: BlogViewModel): Promise < string | null>{     // creates new blog and returns this blog 
        try{
            const answerInsert: InsertOneResult = await blogCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.insertedId ? answerInsert.insertedId.toString() : null;
        } 
        catch (err){
            console.log(err)
            return null;
        }
    },

    
    async edit(id: string, editDate: BlogInputModel): Promise < boolean >{// edits a blog by ID, if the blog is not found returns false    
        try{
            const answerUpdate = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: editDate});
            return answerUpdate.matchedCount != 0 ? true : false; 
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    async delete(id: string): Promise < boolean > {     // deletes a blog by Id, returns true if the blog existed    
        try{
            const answerDelete: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount != 0 ? true : false;
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },


    async clear(): Promise < boolean > {// deletes all blogs from base
        try{
            await blogCollection.deleteMany()
            return await blogCollection.countDocuments({}) == 0 ? true : false;
        } catch(err){
            console.log(err)
            return false;
        }
    },

    mapViewToDb(item: BlogViewModel): BlogDBType {
        
        const _id: ObjectId = ObjectId.isValid(item.id) ? new ObjectId(item.id) : new ObjectId;    
        return { 
            _id: _id,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt,
            isMembership: item.isMembership,
            websiteUrl: item.websiteUrl
            }
                   
        }
}
