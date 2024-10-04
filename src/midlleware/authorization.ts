import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES, SECRET_KEY } from "../setting";
import { jwtService } from "../modules/jwtService";
import { userService } from "../variety/users/userSevice";
import { userQueryRepository } from "../variety/users/repositories/userQueryRepository";




export const authorizatorAdmin = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization;

    if(authheader === 'Basic YWRtaW46cXdlcnR5'){
        next();
        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401);
}

export const authorizatorUser = (req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const authheader = req.headers.authorization
    if(authheader && authheader.split(' ')[0] == 'bearer'){
        const token = authheader.split(' ')[1]
        const userId: string|null = jwtService.findIdbyToken(token, SECRET_KEY)
        if(userId){
            //const user = userQueryRepository.findById(userId)
            req.userId = userId
            next();
        }
    }
    res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401);
    return
}