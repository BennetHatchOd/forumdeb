// import { JwtPayload } from "jsonwebtoken";

// export enum CodStatus {
//     Ok =        200,
//     Created =   201,
//     NoContent = 204,
//     BadRequest = 400, 
//     NotAuth =   401,
//     Forbidden = 403,
//     NotFound =  404,
//     Error =     500,
// }

// export interface StatusResult <T = undefined> {
//     codResult:  CodStatus;
//     message?:   string,  
//     data?: T;  
// }

// export interface tokenPayload extends JwtPayload {
//     userId:     string;
//     version:    string;
//     iat:        number;
//     exp:        number;
//     deviceId:   string;
//   }