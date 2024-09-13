import { BlogViewModel, QueryModel, PaginatorModel} from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";

export const blogQueryRepository = {

 
    async findById(id: string): Promise < BlogViewModel | null > {      // searches for a blog by id and returns this blog or null
        
        if(!ObjectId.isValid(id))
            return null;
        try{
                    
            const searchItem: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId(id)})
            
            if(searchItem) 
                return this.mapDbToOutput(searchItem);
            else
                return null;

        } catch (err){      
            console.log(err)
            return null;
        }

    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<BlogViewModel> > {      // searches for blogs by filter, returns  paginator or null
        
        const nameSearch = queryReq.searchNameTerm ? {name: {$regex: queryReq.searchNameTerm, $options: 'i'}} : {}    
        const queryFilter = {nameSearch}
        
        try{    
            const totalCount: number= await blogCollection.countDocuments(queryFilter) 
            if (totalCount == 0)
                return {
                        pagesCount: 1,
                        page: 1,
                        pageSize: queryReq.pageSize,
                        totalCount: 0,
                        items: []
                        };
            

            
            const searchItem: Array<BlogDBType>  = 
                await blogCollection.find(queryFilter)
                                    .limit(queryReq.pageSize)
                                    .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                    .sort(queryReq.sortBy, queryReq.sortDirection)
                                    .toArray();

            const returnArray: Array<BlogViewModel> = searchItem ? searchItem.map(s => this.mapDbToOutput(s)) : []
            return {
                    pagesCount: Math.ceil(totalCount / queryReq.pageSize),
                    page: queryReq.pageNumber,
                    pageSize: queryReq.pageSize,
                    totalCount: totalCount,
                    items: returnArray
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
                }   
        }
    },

    mapDbToOutput(item: BlogDBType): BlogViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
 