import {IdType} from "./types";

declare global {
    namespace Express {
        export interface Request {
            user: IdType | undefined;
            // cookies: {
            //     sessionId?: string;
            //     userPref?: string;
            //     [key: string]: string | undefined;  // Для произвольных cookie
            //   };
        }
    }
}