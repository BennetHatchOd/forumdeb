import { SortDirection } from "mongodb"

 export type FieldError = {
    message: string,
    field: string
}

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type PaginatorModel<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<T>
}

export type QueryModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
    blogId?: string,
    searchNameTerm?: string,
    searchEmailTerm?: string,
    searchLoginTerm?: string
}

export type IdType = { id: string }

