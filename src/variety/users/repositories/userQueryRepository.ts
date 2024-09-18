import { UserViewModel, PaginatorModel, QueryModel, APIErrorResult, FieldError} from "../../../types";
import { userCollection } from "../../../db/db";
import { UserDBType } from "../../../db/dbTypes";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../modules/paginator";

export const userQueryRepository = {

    async findById(id: string): Promise < UserViewModel | null > {      // searches for a user by id and returns this user or null
        
        if(!ObjectId.isValid(id))
            return null;
        try{                   
            const searchItem: UserDBType | null = await userCollection.findOne({_id: new ObjectId(id)})           
            return searchItem ? this.mapDbToOutput(searchItem) : null;
        } 
        catch (err){      
            console.log(err)
            throw(err);
        }

    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<UserViewModel> > {      // searches for users by filter, returns  paginator or null
        
        const emailSearch = queryReq.searchEmailTerm ? {name: {$regex: queryReq.searchEmailTerm, $options: 'i'}} : {}    
        const loginSearch = queryReq.searchLoginTerm ? {name: {$regex: queryReq.searchLoginTerm, $options: 'i'}} : {}    
        const queryFilter = {$or: [emailSearch, loginSearch]}
        try{    
            const totalCount: number= await userCollection.countDocuments(queryFilter) 
            if (totalCount == 0)
                return emptyPaginator;
            
            const searchItem: Array<UserDBType>  = 
                await userCollection.find(queryFilter)
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
            throw(err);
        }
    },

    mapDbToOutput(item: UserDBType): UserViewModel {
        
        return {
            id: item._id.toString(),
            
            login: item.login,
            email: item.email,
            createdAt: item.createdAt,
        }       
    }
}
 