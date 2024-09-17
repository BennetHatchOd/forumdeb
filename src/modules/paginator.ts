import { QueryBaseModel} from "../types";
import { Collection } from "mongodb";


export function paginator(input: QueryBaseModel): QueryBaseModel {
    return {
        sortBy: input.sortBy ? input.sortBy : 'createdAt',
        sortDirection: input.sortDirection ? input.sortDirection : 'desc',
        pageNumber: input.pageNumber ? +input.pageNumber : 1,
        pageSize: input.pageSize ? +input.pageSize : 10,
    }
}

export const emptyPaginator = {
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
}

// export const paginatorQueryRepositories = (collection:Collection, ) => {

// try{           
//     const totalCount: number= await postCollection.countDocuments(queryFilter)   
//     if (totalCount == 0)
//         return emptyPaginator;
           
    
//     const searchItem: Array<PostDBType> = 
//         await postCollection.find(queryFilter)
//                             .limit(queryReq.pageSize)
//                             .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
//                             .sort(queryReq.sortBy, queryReq.sortDirection)
//                             .toArray()

//     const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
//     return {
//             pagesCount: Math.ceil(totalCount / queryReq.pageSize),
//             page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
//             pageSize: queryReq.pageSize,
//             totalCount: totalCount,
//             items: searchItem.map(s => this.mapDbToOutput(s))
//         } 
// } 
// catch (err){      
//     console.log(err)
//     return emptyPaginator;

// }
// }