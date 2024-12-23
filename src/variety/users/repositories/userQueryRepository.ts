import { PaginatorType, QueryType} from "../../../types/types";
import { userCollection } from "../../../db/db";
import { UserDBType } from "../../../db/dbTypes";
import { ObjectId, WithId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { UserViewType } from "../types";

export const userQueryRepository = {

    async findById(id: string): Promise < UserViewType | null > {      // searches for a user by id and returns this user or null
        
        if(!ObjectId.isValid(id))
            return null;
        const searchItem: WithId<UserDBType> | null = await userCollection.findOne({_id: new ObjectId(id)})           
        return searchItem ? this.mapDbToOutput(searchItem) : null;
    },

    async find(queryReq:  QueryType): Promise < PaginatorType<UserViewType> > {      // searches for users by filter, returns  paginator or null
        
        
        let queryUserFilter = {$match: {}}
        let queryAuthFilter = {$match: {}}
        let directSort = [1, 'asc', 'ascending'].includes(queryReq.sortDirection as string|number) ? 1 : -1
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

        const pipeline = [
            queryUserFilter, 
            {$project: {_id: 1, login: 1, email: 1, createdAt: 1, password: 1}},
            {$unionWith: {
                    coll: "unconfirmedUsers", 
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

        const countPipeline = [...pipeline, { $count: "totalCount" }]
        const findPipeline = [
                 ...pipeline,             
                { $sort: {[queryReq.sortBy]: directSort} },
                { $skip: (queryReq.pageNumber - 1) * queryReq.pageSize }, 
                { $limit: queryReq.pageSize }]


        // const countPipeline = [
        //     queryUserFilter, 
        //     {$project: {_id: 1, login: 1, email: 1, createdAt: 1}},
        //     {$unionWith: {
        //             coll: "unconfirmedUsers", 
        //             pipeline: [
        //                 queryAuthFilter,
        //                 {$project: {_id: 1, 
        //                             login: "$user.login", 
        //                             email: "$user.email", 
        //                             createdAt: "$user.createdAt"}}]
        //         }
        //     },
        //     { $count: "totalCount" },
        // ];

        // const findPipeline = [
        //     queryUserFilter, 
        //     {$project: {_id: 1, login: 1, email: 1, createdAt: 1}},
        //     {$unionWith: {
        //             coll: "unconfirmedUsers", 
        //             pipeline: [
        //                 queryAuthFilter,
        //                 {$project: {_id: 1, 
        //                             login: "$user.login", 
        //                             email: "$user.email", 
        //                             createdAt: "$user.createdAt"}}]
        //         }
        //     },
        //     { $sort: {[queryReq.sortBy]: directSort} },
        //     { $skip: (queryReq.pageNumber - 1) * queryReq.pageSize }, 
        //     { $limit: queryReq.pageSize }
        // ];



        const countArray= await userCollection.aggregate(countPipeline).toArray()
        // console.log(countArray)
        if (countArray.length == 0)
            return emptyPaginator;
        const totalCount: number= countArray[0].totalCount
         
        const searchItem: Array<WithId<UserDBType>>   
            = await userCollection.aggregate(findPipeline).toArray() as Array<WithId<UserDBType>>;

        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToOutput(s))
            }
    },

    mapDbToOutput(item: WithId<UserDBType>): UserViewType {
        
        return {
            id: item._id.toString(),
            
            login: item.login,
            email: item.email,
            createdAt: item.createdAt.toISOString(),
        }       
    }
}
