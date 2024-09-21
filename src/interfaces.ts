export enum CodStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400, 
    NotAuth = 401,
    NotFound = 404,
    Error = 500,
}

export interface StatusResult <T = null> {
    codResult: CodStatus;
    message?: string,  
    data?: T;  
    error?: Error;
  }