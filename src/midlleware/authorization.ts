import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES, PASSCODE_ADMIN, SECRET_KEY } from "../setting";
import { jwtService } from "../modules/jwtService";
import { IdType } from "../types/types";

export const authorizatorAdmin = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization;

    if(authheader && authheader.split(' ')[0] == 'Basic'){

        const buff = Buffer.from(PASSCODE_ADMIN, 'utf-8');
        const base64 = buff.toString('base64');
 
        if(authheader.split(' ')[1] == base64){
            next();
            return;
        }
    }

    res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401);
}

export const authorizatorUser = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization
    if(authheader && authheader.split(' ')[0] == 'Bearer'){
        const token = authheader.split(' ')[1]
        const userId: string|null = jwtService.findIdbyToken(token, SECRET_KEY)
        if(userId){
            req.user = {id: userId} as IdType;
            next();
            return
        }
    }
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
}