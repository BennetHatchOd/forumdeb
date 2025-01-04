import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { BlogInputType, BlogViewType } from "../types";
import { CodStatus, StatusResult } from "../../../types/types";
import { BlogDocument, BlogModel, BlogType } from "../domain/blog.entity";

export class BlogRepository {

    async isExist(id: string): Promise < StatusResult > {     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await BlogModel.countDocuments({_id: new ObjectId(id)})           
        
        return exist == 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    }
 
    async findById(id: string): Promise < StatusResult<BlogViewType|undefined> > {     
        
         
        if(!ObjectId.isValid(id))
            return {codResult: CodStatus.NotFound};
        const searchItem: BlogDocument | null = await BlogModel.findOne({_id: new ObjectId(id)})           
        return searchItem  
            ? {codResult: CodStatus.Ok, data: this.mapDbToView(searchItem)} 
            : {codResult: CodStatus.NotFound};
    }

    async create(createItem: BlogType): Promise <StatusResult<string|undefined>>{      
        const answerInsert: BlogDocument = await BlogModel.create(createItem);
        
        return {codResult: CodStatus.Created, data: answerInsert._id.toString()}   
    }

    async edit(id: string, editData: BlogInputType): Promise <StatusResult>{    
        const blog: BlogDocument | null = await BlogModel.findOne({_id: new ObjectId(id)});
        if(!blog) throw "can't find blog"
        
        blog.name           = editData.name
        blog.description    = editData.description
        blog.websiteUrl     = editData.websiteUrl
        
        await blog.save()

        return {codResult: CodStatus.NoContent} 
    }

    async delete(id: string): Promise <StatusResult> {   
    //  deletes an existing blog, if there is no blog it gives an error
        
        const answerDelete: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})

        if(answerDelete.deletedCount == 1)
            return {codResult: CodStatus.NoContent}  
        
        throw 'the server can\'t delete blog'
    }


    async clear(): Promise <StatusResult> {
        await BlogModel.deleteMany()

        if(await BlogModel.countDocuments({}) == 0)
           return {codResult: CodStatus.NoContent }
        
        throw "the server can\'t clear blog"
    }

    mapDbToView(item: BlogDocument): BlogViewType {
        
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
