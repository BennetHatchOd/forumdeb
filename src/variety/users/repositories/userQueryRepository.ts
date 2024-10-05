import { PaginatorModel, QueryModel} from "../../../types/types";
import { userCollection } from "../../../db/db";
import { UserDBModel } from "../../../db/dbTypes";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../modules/paginator";
import { UserViewModel } from "../types";

export const userQueryRepository = {

    async findById(id: string): Promise < UserViewModel | null > {      // searches for a user by id and returns this user or null
        
        if(!ObjectId.isValid(id))
            return null;
        const searchItem: WithId<UserDBModel> | null = await userCollection.findOne({_id: new ObjectId(id)})           
        return searchItem ? this.mapDbToOutput(searchItem) : null;
    },

    async find(queryReq:  QueryModel): Promise < PaginatorModel<UserViewModel> > {      // searches for users by filter, returns  paginator or null
        
        
        let queryFilter = {}
        if(queryReq.searchLoginTerm || queryReq.searchEmailTerm)
            queryFilter = {
                $or: [
                ...(queryReq.searchLoginTerm ? [{ login: { $regex: queryReq.searchLoginTerm, $options: 'i' } }] : []),
                ...(queryReq.searchEmailTerm ? [{ email: { $regex: queryReq.searchEmailTerm, $options: 'i' } }] : [])
                ]
            }
                
        const totalCount: number= await userCollection.countDocuments(queryFilter) 
        if (totalCount == 0)
            return emptyPaginator;
         
        const searchItem: Array<WithId<UserDBModel>>  = 
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
    },

    mapDbToOutput(item: WithId<UserDBModel>): UserViewModel {
        
        return {
            id: item._id.toString(),
            
            login: item.login,
            email: item.email,
            createdAt: item.createdAt,
        }       
    }
}
 