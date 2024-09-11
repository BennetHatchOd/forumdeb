import { SortDirection } from "mongodb"

 
type FieldError = {
    message: string,
    field: string
}

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl:	string
}

export type BlogViewModel = {
    id:	string,
    name: string,
    description: string,
    createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}


export type PostInputModel = {
    title:	string,
    shortDescription: string,
    content: string,
    blogId:	string,
}

export type PostViewModel = {
    id:	string,
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: string,
    blogId:	string,
    blogName:	string
}

export type QueryModel = {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
}

export type PaginatorModel<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<T>
}