import { QueryModel} from "../types";
import { Collection } from "mongodb";


export function paginator(input: QueryModel): QueryModel {
      
    return {
        sortBy: input.sortBy ? input.sortBy : 'createdAt',
        sortDirection: input.sortDirection ? input.sortDirection : 'desc',
        pageNumber: pageValidator(input.pageNumber),
        pageSize: pageSizeValidator(input.pageSize),
        searchNameTerm: input.searchNameTerm,// ? input.searchNameTerm : null,
        searchEmailTerm: input.searchEmailTerm,// ? input.searchEmailTerm : null,
        searchLoginTerm: input.searchLoginTerm,// ? input.searchLoginTerm : null,
        blogId: input.blogId // ? ,
    }
}

export const emptyPaginator = {
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
}

const pageValidator = (page: number): number =>{
   
    if(page < 1 || (Math.floor(page) - page != 0))
        return 1;

    return page;

}
const pageSizeValidator = (size: number): number =>{
   
    if(size < 1 || (Math.floor(size) - size != 0) || size > 100)
        return 10;

    return size;

}
