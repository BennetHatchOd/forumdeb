import { BlogViewModel, BlogInputModel } from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { CodStatus, StatusResult} from "../../../interfaces";
import { catchErr } from "../../../modules/catchErr";

export const blogRepository = {

 
    async isExist(id: string): Promise < StatusResult > {     
        
        try{
            if(!ObjectId.isValid(id))    
                return {codResult : CodStatus.NotFound};

            const exist: number = await blogCollection.countDocuments({_id: new ObjectId(id)})           
            
            return exist > 0  
                  ? {codResult: CodStatus.Ok} 
                  : {codResult: CodStatus.NotFound};
        } 
        catch (err){
            return catchErr(err);
        }
    },
 
    async findNameById(id: string): Promise < StatusResult<string|null> > {     
        
         
        if(!ObjectId.isValid(id))
            return {codResult: CodStatus.NotFound};
        try{                   
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})           
            return searchItem  
              ? {codResult: CodStatus.Ok, data: searchItem.name} 
              : {codResult: CodStatus.NotFound};
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async create(createItem: BlogViewModel): Promise <StatusResult<string|null>>{      
        try{
            const answerInsert: InsertOneResult = await blogCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.acknowledged  
              ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
              : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },

    
    async edit(id: string, editDate: BlogInputModel): Promise <StatusResult>{    
        try{
            const answerUpdate: UpdateResult = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: editDate});
            if(!answerUpdate.acknowledged)
                return {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
            
            return answerUpdate.matchedCount != 0 
                 ? {codResult: CodStatus.NoContent} 
                 : {codResult: CodStatus.NotFound}; 
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async delete(id: string): Promise <StatusResult> {         
        try{
            const answerDelete: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount == 1 ?
                    {codResult: CodStatus.NoContent} : 
                    {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },


    async clear(): Promise <StatusResult> {
        try{
            await blogCollection.deleteMany()
            return await blogCollection.countDocuments({}) == 0 ?
                {codResult: CodStatus.NoContent } : 
                {codResult: CodStatus.Error};
        } 
        catch(err){
            return catchErr(err);
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
