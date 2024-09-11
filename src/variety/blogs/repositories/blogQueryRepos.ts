import { BlogViewModel, PostViewModel, QueryModel, PaginatorModel} from "../../../types";
import { blogCollection } from "../../../db/db";
import { BlogDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";

export const blogQueryRepos = {

 
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

    //, blogId: string | boolean = false
    async find(queryReq: QueryModel): Promise < PaginatorModel<BlogViewModel> | null > {      // searches for a blog by id and returns this blog or null
        
        try{
            const totalCount: number= await blogCollection.countDocuments({name: {$regex: queryReq.searchNameTerm}})                       
            
            const searchItem: Array<BlogDBType> | null = 
                await blogCollection.find({name: {$regex: queryReq.searchNameTerm}})
                                    .limit(queryReq.pageSize)
                                    .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                    .sort(queryReq.sortBy, queryReq.sortDirection)
                                    .toArray()
                if(searchItem){ 
                    const returnArray: Array<BlogViewModel> = searchItem.map(s => this.mapDbToOutput(s))
                    return {
                            pagesCount: Math.ceil(totalCount / queryReq.pageSize),
                            page: queryReq.pageNumber,
                            pageSize: queryReq.pageSize,
                            totalCount: totalCount,
                            items: returnArray
                        } 
                }
                else
                    return null;
        } catch (err){      
            console.log(err)
            return null;
            }
    },

    mapDbToOutput(item: BlogDBType): BlogViewModel {
        
        const {_id, ...rest} = item
        return {...rest,   id: _id.toString()}       
    }
 
}
 