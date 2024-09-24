import { PostViewModel, QueryModel, PaginatorModel} from "../../../types";
import { blogCollection, postCollection } from "../../../db/db";
import { PostDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../modules/paginator";

export const postQueryRepository = {

 
    async findById(id: string): Promise < PostViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        if(!ObjectId.isValid(id))
            return null;
        try{                   
            const searchItem: PostDBType | null = 
                await postCollection.findOne({_id: new ObjectId(id)})
            
            return searchItem 
                 ? this.mapDbToOutput(searchItem) 
                 : null;
        } 
        catch (err){      
            console.log(err)
            throw(err);
        }

    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<PostViewModel> > {      // searches for blogs by filter, returns paginator or null
        
        const bloqIdSearch = queryReq.blogId ? {blogId: queryReq.blogId} : {}   
        const queryFilter = {...bloqIdSearch}
        
        const totalCount: number= await postCollection.countDocuments(queryFilter)   
        if (totalCount == 0)
            return emptyPaginator;
                
        const searchItem: Array<PostDBType> = 
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

    mapDbToOutput(item: PostDBType): PostViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
 