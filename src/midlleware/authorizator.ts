import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../setting";




export const authorizator = (req: Request, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization;

    if(authheader === 'Basic YWRtaW46cXdlcnR5'){
        next();
        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401);
}