import { PaginatorModel, QueryModel} from "../../../types/types";
import { blogCollection } from "../../../db/db";
import { BlogDBModel } from "../../../db/dbTypes";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { BlogViewModel } from "../types";

export const blogQueryRepository = {

 
    async findById(id: string): Promise <BlogViewModel | null > {      
        
        if(!ObjectId.isValid(id))
            return null;                   
            const searchItem: WithId<BlogDBModel> | null = await blogCollection.findOne({_id: new ObjectId(id)})           
            return searchItem 
                 ? this.mapDbToView(searchItem) 
                 : null 
    },
  
    async find(queryReq:  QueryModel): Promise < PaginatorModel<BlogViewModel> > {      
        
        const nameSearch = queryReq.searchNameTerm ? {name: {$regex: queryReq.searchNameTerm, $options: 'i'}} : {}    
        const queryFilter = {...nameSearch}
        const totalCount: number= await blogCollection.countDocuments(queryFilter) 
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
   
        if (totalCount == 0)
            return emptyPaginator;  
        
        const searchItem: Array<WithId<BlogDBModel>>  = 
            await blogCollection.find(queryFilter)
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort(queryReq.sortBy, queryReq.sortDirection)
                                .toArray();
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToView(s))
        }
    },

    mapDbToView(item: WithId<BlogDBModel>): BlogViewModel {
        
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
 