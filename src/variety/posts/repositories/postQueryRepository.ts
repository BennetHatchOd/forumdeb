import { PostViewModel, QueryModel, PaginatorModel} from "../../../types";
import { blogCollection, postCollection } from "../../../db/db";
import { PostDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";

export const postQueryRepository = {

 
    async findById(id: string): Promise < PostViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        if(!ObjectId.isValid(id))
            return null;
        try{                   
            const searchItem: PostDBType | null = 
                await postCollection.findOne({_id: new ObjectId(id)})
            
            if(searchItem) 
                return this.mapDbToOutput(searchItem);
            else
                return null;

        } catch (err){      
            console.log(err)
            return null;
        }

    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<PostViewModel> > {      // searches for blogs by filter, returns paginator or null
        
        const bloqIdSearch = queryReq.blogId ? {blogId: new ObjectId(queryReq.blogId)} : {}        
        const queryFilter = {bloqIdSearch}

        try{           
            const totalCount: number= await postCollection.countDocuments(queryFilter)   
            if (totalCount == 0)
                return {
                        pagesCount: 1,
                        page: 1,
                        pageSize: queryReq.pageSize,
                        totalCount: 0,
                        items: []
                    };                    
            
            const searchItem: Array<PostDBType> = 
                await postCollection.find(queryFilter)
                                    .limit(queryReq.pageSize)
                                    .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                    .sort(queryReq.sortBy, queryReq.sortDirection)
                                    .toArray() 
            return {
                    pagesCount: Math.ceil(totalCount / queryReq.pageSize),
                    page: queryReq.pageNumber,
                    pageSize: queryReq.pageSize,
                    totalCount: totalCount,
                    items: searchItem.map(s => this.mapDbToOutput(s))
                } 
        } 
        catch (err){      
            console.log(err)
            return {
                    pagesCount: 1,
                    page: 1,
                    pageSize: queryReq.pageSize,
                    totalCount: 0,
                    items: []
                };
        }
    },

    mapDbToOutput(item: PostDBType): PostViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
 