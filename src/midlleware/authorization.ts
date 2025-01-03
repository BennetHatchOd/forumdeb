import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES, PASSCODE_ADMIN, SECRET_KEY } from "../setting";
import { CodStatus, IdType } from "../types/types";
import { authService, deviceQueryRepository, jwtAdapter } from "../instances";

export const authAdminByPassword = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

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

export const authUserByAccessT = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization
    if(authheader && authheader.split(' ')[0] == 'Bearer'){
        const token = authheader.split(' ')[1]
        const userId = jwtAdapter.calcPayloadAT(token)
        if(userId){
            req.user = {id: userId} as IdType;
            next();
            return
        }
    }
    res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401);
}

export const authUserByRefreshT = async(req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const refreshToken= req.cookies.refreshToken
    const checkToken = await authService.checkRefreshtoken(refreshToken)
    if(checkToken.codResult == CodStatus.NotAuth){
        res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
        return;
    }
    req.payload = {payload: checkToken.data};
    next();
    return
}


