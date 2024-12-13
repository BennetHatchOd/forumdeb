import { Response, Request, NextFunction } from "express";
import { authService } from "../variety/auth/authSevice";
import { HTTP_STATUSES } from "../setting";

export const rateLimiting = async(req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const ipAdress = (req.ip!).replace(/^::ffff:/, '')
    const url = req.originalUrl
    const date = new Date()
    
    const permision: boolean = await authService.rateLimiting(ipAdress, url, date)

    if (permision){
        next()
        return
    }
    res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).send({})

}