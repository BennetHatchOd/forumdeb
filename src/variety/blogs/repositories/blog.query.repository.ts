import { PaginatorType, QueryType} from "../../../types/types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/db.types";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { BlogViewType } from "../types";

export const blogQueryRepository = {

 
    async findById(id: string): Promise <BlogViewType | null > {      
        
        if(!ObjectId.isValid(id))
            return null;                   
            const searchItem: WithId<BlogDBType> | null = await blogCollection.findOne({_id: new ObjectId(id)})           
            return searchItem 
                 ? this.mapDbToView(searchItem) 
                 : null 
    },
  
    async find(queryReq:  QueryType): Promise < PaginatorType<BlogViewType> > {      
        
        const nameSearch = queryReq.searchNameTerm ? {name: {$regex: queryReq.searchNameTerm, $options: 'i'}} : {}    
        const queryFilter = {...nameSearch}
        const totalCount: number= await blogCollection.countDocuments(queryFilter) 
        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize)
   
        if (totalCount == 0)
            return emptyPaginator;  
        
        const searchItem: Array<WithId<BlogDBType>>  = 
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
 