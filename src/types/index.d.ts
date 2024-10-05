import {IdType} from "./types";

declare global {
    namespace Express {
        export interface Request {
            user: IdType | undefined;
        }
    }
}