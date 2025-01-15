import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting/setting.path.name';
import { Rating } from "../types";
import { LikeService } from "../application/like.service";
import { StatusResult } from "../../../types/types";

export class LikeControllers { 

    constructor(private likeService: LikeService){
    }
    
    async rangeComment(req: Request<{id: string},{},{"likeStatus": Rating}>, res: Response){
        try{
            const answer: StatusResult  = await this.likeService.setRangeComment(req.params.id, req.body.likeStatus, req.user!.id)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }    
    
   
} 
  
   
   