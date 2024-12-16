import { QueryModel, PaginatorModel} from "../../../types/types";
import { postCollection } from "../../../db/db";
import { PostDBModel } from "../../../db/dbTypes";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { PostViewModel } from "../types";

export const postQueryRepository = {

 
    async findById(id: string): Promise < PostViewModel | null > {      
        
        if(!ObjectId.isValid(id))
            return null;
        const searchItem: WithId<PostDBModel> | null = 
            await postCollection.findOne({_id: new ObjectId(id)})
        
        return searchItem 
            ? this.mapDbToOutput(searchItem) 
            : null;
    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<PostViewModel> > { 
        
        const bloqIdSearch = queryReq.blogId ? {blogId: queryReq.blogId} : {}   
        const queryFilter = {...bloqIdSearch}
        
        const totalCount: number= await postCollection.countDocuments(queryFilter)   
        
        if (totalCount == 0)
            return emptyPaginator;
                
        const searchItem: Array<WithId<PostDBModel>> = 
            await postCollection.find(queryFilter)
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort(queryReq.sortBy, queryReq.sortDirection)
                                .toArray()

        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToOutput(s))
            } 
 

    },

    mapDbToOutput(item: WithId<PostDBModel>): PostViewModel {
        
        return { 
            id: item._id.toString(),
            title:	item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            createdAt: item.createdAt.toISOString(),
            blogId:	item.blogId,
            blogName:	item.blogName
        }       
    }
 
}
 