import { JwtPayload } from "jsonwebtoken"
import { SortDirection } from "mongodb"

 export type FieldError = {
    message: string,
    field: string
}

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type PaginatorType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<T>
}

export type QueryType = {
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

export enum CodStatus {
    Ok =        200,
    Created =   201,
    NoContent = 204,
    BadRequest = 400, 
    NotAuth =   401,
    Forbidden = 403,
    NotFound =  404,
    Error =     500,
}

export type StatusResult <T = undefined> = {
    codResult:  CodStatus;
    message?:   string,  
    data?: T;  
}

export type tokenPayload = {
    userId:     string;
    version:    string;
    iat:        number;
    exp:        number;
    deviceId:   string;
  }