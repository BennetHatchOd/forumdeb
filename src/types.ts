import { SortDirection } from "mongodb"

 
export type FieldError = {
    message: string,
    field: string
}

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type BlogInputModel = {
    name: string,                   // length 1-15
    description: string,            // length 1-500
    websiteUrl:	string              // length 1-100, ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}


export type BlogViewModel = {
    id:	string,
    name: string,
    description: string,
    createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}

export type BlogPostInputModel = {
    title:	string,                 // length 1-30
    shortDescription: string,       // length 1-100
    content: string,                // length 1-1000
}

export type PostInputModel = {
    title:	string,                 // length 1-30
    shortDescription: string,       // length 1-100
    content: string,                // length 1-1000
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

export type PaginatorModel<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<T>
}

export type LoginInputModel = {
    loginOrEmail:	string,
    password:	string,
}
    
export type UserInputModel = {
    login:	string,         // unique, length 3-10, ^[a-zA-Z0-9_-]*$
    password:	string,     // length: 6-20
    email:	string,         // unique, ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
}

export type UserViewModel = {
    id:	string,
    login:	string,
    email:	string,
    createdAt:	string
}

export type UserInnerModel = UserViewModel & {
    password: string,
}

export type QueryModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
    blogId?: string | null,
    searchNameTerm?: string | null,
    searchEmailTerm?: string | null,
    searchLoginTerm?: string | null,
}

