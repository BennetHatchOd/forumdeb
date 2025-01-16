import {Request, Response, NextFunction } from "express";
import { Rating } from "../../types";
import { HTTP_STATUSES } from "../../../../setting/setting.path.name";

export function likeValidator(req: Request, res: Response, next: NextFunction){

    const like = req.body.likeStatus
    if(Object.values(Rating).includes(like)){
        next()
        return
    }
    res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        message: `likeStatus has incorrect values`,
        field:   `likeStatus`,
    })

}