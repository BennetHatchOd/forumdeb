import { PaginatorType, QueryType} from "../../../types/types";
import { ObjectId} from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { UserViewType } from "../types";
import { UserDocument, UserModel } from "../domain/user.entity";
import { PipelineStage } from "mongoose";

export class UserQueryRepository {

    async findById(id: string): Promise < UserViewType | null > {      // searches for a user by id and returns this user or null
        
        if(!ObjectId.isValid(id))
            return null;
        const searchItem: UserDocument | null = await UserModel.findOne({_id: new ObjectId(id)})           
        return searchItem ? this.mapDbToOutput(searchItem) : null;
    }

    async find(queryReq:  QueryType): Promise < PaginatorType<UserViewType> > {      // searches for users by filter, returns  paginator or null
        
        
        let queryUserFilter: PipelineStage.Match = {$match: {}}
        let queryAuthFilter: PipelineStage.Match = {$match: {}}
        let directSort = ([1, 'asc', 'ascending'].includes(queryReq.sortDirection as string|number) ? 1 : -1) as -1|1
        if(queryReq.searchLoginTerm || queryReq.searchEmailTerm){
            queryUserFilter = {$match:{
                $or: [
                ...(queryReq.searchLoginTerm ? [{ login: { $regex: queryReq.searchLoginTerm, $options: 'i' } }] : []),
                ...(queryReq.searchEmailTerm ? [{ email: { $regex: queryReq.searchEmailTerm, $options: 'i' } }] : [])
                ]
            }}
            queryAuthFilter = {$match:{
                $or: [
                ...(queryReq.searchLoginTerm ? [{ 'user.login': { $regex: queryReq.searchLoginTerm, $options: 'i' } }] : []),
                ...(queryReq.searchEmailTerm ? [{ 'user.email': { $regex: queryReq.searchEmailTerm, $options: 'i' } }] : [])
                ]
            }}        
        }

        const pipeline: PipelineStage[] = [
            queryUserFilter, 
            {$project: {_id: 1, login: 1, email: 1, createdAt: 1, password: 1}},
            {$unionWith: {
                    coll: "unconfirmedusers", 
                    pipeline: [
                        queryAuthFilter,
                        {$project: {_id: 1, 
                                    login: "$user.login", 
                                    password: "$user.pasword", 
                                    email: "$user.email", 
                                    createdAt: "$user.createdAt"}}]
                }
            },
        ];

        const countPipeline: PipelineStage[]  = [...pipeline, { $count: "totalCount" }]
        const findPipeline: PipelineStage[] = [
                 ...pipeline,             
                { $sort: {[queryReq.sortBy]: directSort} },
                { $skip: (queryReq.pageNumber - 1) * queryReq.pageSize }, 
                { $limit: queryReq.pageSize }]



        const countArray= await UserModel.aggregate(countPipeline)
        // console.log(countArray)
        if (countArray.length == 0)
            return emptyPaginator;
        const totalCount: number= countArray[0].totalCount
         
        const searchItem: UserDocument[]   
            = await UserModel.aggregate(findPipeline) 

        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToOutput(s))
            }
    }

    mapDbToOutput(item: UserDocument): UserViewType {
        
        return {
            id: item._id.toString(),
            login: item.login,
            email: item.email,
            createdAt: item.createdAt.toISOString(),
        }       
    }
}
