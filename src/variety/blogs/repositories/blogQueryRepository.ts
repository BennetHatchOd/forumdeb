import { BlogViewModel, PaginatorModel, QueryBlogModel} from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../modules/paginator";

export const blogQueryRepository = {

 
    async findById(id: string): Promise < BlogViewModel | null > {      
        
        if(!ObjectId.isValid(id))
            return null;
        try{                   
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})           
            return searchItem ? this.mapDbToOutput(searchItem) : null;
        } 
        catch (err){      
            console.log(err)
            return null;
        }

    },
  
    async find(queryReq:  QueryBlogModel): Promise < PaginatorModel<BlogViewModel> > {      
        
        const nameSearch = queryReq.searchNameTerm ? {name: {$regex: queryReq.searchNameTerm, $options: 'i'}} : {}    
        const queryFilter = {...nameSearch}
        try{    
            const totalCount: number= await blogCollection.countDocuments(queryFilter) 
            if (totalCount == 0)
                return emptyPaginator;  
            
            const searchItem: Array<BlogDBType>  = 
                await blogCollection.find(queryFilter)
                                    .limit(queryReq.pageSize)
                                    .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                    .sort(queryReq.sortBy, queryReq.sortDirection)
                                    .toArray();

            const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
            return {
                    pagesCount: pagesCount,
                    page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                    pageSize: queryReq.pageSize,
                    totalCount: totalCount,
                    items: searchItem.map(s => this.mapDbToOutput(s))
                } 
        } 
        catch (err){      
            console.log(err)
            return emptyPaginator;   
        }
    },

    mapDbToOutput(item: BlogDBType): BlogViewModel {
        
        return {
            id: item._id.toString(),
            
            name: item.name,
            description: item.description,
            createdAt: item.createdAt,
            isMembership: item.isMembership,
            websiteUrl: item.websiteUrl
        }       
    }
}
 