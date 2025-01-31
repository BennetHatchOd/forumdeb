import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting/setting.path.name';
import { LikeComment, LikePost, Rating } from "../types";
import { LikeService } from "../application/like.service";
import { StatusResult } from "../../../types/types";
import { CommentType } from "../../comments/domain/comment.entity";
import { PostType } from "../../posts/domain/post.entity";

export class LikeControllers { 

    constructor(private likeService: LikeService){
    }
    
    async rangeComment(req: Request<{id: string},{},{"likeStatus": Rating}>, res: Response){
        try{
            const answer: StatusResult  = await this.likeService.setRangeEntity<CommentType>(req.params.id, req.body.likeStatus, req.user!.id, LikeComment)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    } 
    
    async rangePost(req: Request<{id: string},{},{"likeStatus": Rating}>, res: Response){
        try{
            const answer: StatusResult  = await this.likeService.setRangeEntity<PostType>(req.params.id, req.body.likeStatus, req.user!.id, LikePost)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    } 
} 
  
   
   