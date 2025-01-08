import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../setting/setting.path.name";
import { authService } from "../instances";

export const rateLimiting = async(req: Request<any, any, any, any>, res: Response, next: NextFunction) =>{

    const ipAdress = (req.ip!).replace(/^::ffff:/, '')//req.ip!
    const url = req.originalUrl
    const date = new Date()
    
    const permision: boolean = await authService.rateLimiting(ipAdress, url, date)

    if (permision){
        next()
        return
    }
    res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).send({})

}