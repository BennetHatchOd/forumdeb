import { BlogViewModel, BlogInputModel } from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";

export const blogRepository = {

 
    async isExist(id: string): Promise < boolean > {     
        
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
 
    async findNameById(id: string): Promise < string | null > {     
        
        if(!ObjectId.isValid(id))
            return null;
        try{                   
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})           
            return searchItem ? searchItem.name : null;
        } 
        catch (err){      
            console.log(err)
            return null;
        }

    },

    async create(createItem: BlogViewModel): Promise < string | null>{      
        try{
            const answerInsert: InsertOneResult = await blogCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.insertedId ? answerInsert.insertedId.toString() : null;
        } 
        catch (err){
            console.log(err)
            return null;
        }
    },

    
    async edit(id: string, editDate: BlogInputModel): Promise < boolean >{    
        try{
            const answerUpdate = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: editDate});
            return answerUpdate.matchedCount != 0 ? true : false; 
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },

    async delete(id: string): Promise < boolean > {         
        try{
            const answerDelete: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount != 0 ? true : false;
        } 
        catch (err){
            console.log(err)
            return false;
        }
    },


    async clear(): Promise < boolean > {
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
