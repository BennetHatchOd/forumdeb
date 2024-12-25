import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/db.types";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { CodStatus, StatusResult} from "../../../types/interfaces";
import { BlogInputType, BlogViewType } from "../types";

export const blogRepository = {

    async isExist(id: string): Promise < StatusResult > {     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await blogCollection.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    },
 
    async findById(id: string): Promise < StatusResult<BlogViewType|undefined> > {     
        
         
        if(!ObjectId.isValid(id))
            return {codResult: CodStatus.NotFound};
        const searchItem: WithId<BlogDBType> | null = await blogCollection.findOne({_id: new ObjectId(id)})           
        return searchItem  
            ? {codResult: CodStatus.Ok, data: this.mapDbToView(searchItem)} 
            : {codResult: CodStatus.NotFound};
    },

    async create(createItem: BlogDBType): Promise <StatusResult<string|undefined>>{      
        const answerInsert: InsertOneResult = await blogCollection.insertOne(createItem);
        
        return answerInsert.acknowledged  
            ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
            : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },

    
    async edit(id: string, editDate: BlogInputType): Promise <StatusResult>{    
        const answerUpdate: UpdateResult = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: editDate});
        
        if(!answerUpdate.acknowledged)
            return {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        
        return answerUpdate.matchedCount != 0 
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound}; 
    },

    async delete(id: string): Promise <StatusResult> {         
        const answerDelete: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
               ? {codResult: CodStatus.NoContent}  
               : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
    },


    async clear(): Promise <StatusResult> {
        await blogCollection.deleteMany()

        return await blogCollection.countDocuments({}) == 0 
           ? {codResult: CodStatus.NoContent }  
           : {codResult: CodStatus.Error};
    
    },

    mapDbToView(item: WithId<BlogDBType>): BlogViewType {
        
        return {
            id: item._id.toString(),
            name: item.name,
            description: item.description,
            createdAt: item.createdAt.toISOString(),
            isMembership: item.isMembership,
            websiteUrl: item.websiteUrl
        }       
    }
}
