import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import {PostViewModel, PostInputModel, APIErrorResult } from '../../../types';
import { postRepository } from "../repositories/postRepository";
import { postService } from "../postService";
import { postQueryRepository } from "../repositories/postQueryRepository";

export const postPostController = async (req: Request<{},{},PostInputModel>, res: Response) =>{
  
    const postId: string | null = await postService.create(req.body);  
    
    if(!postId){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    
    const post: PostViewModel | null = await postQueryRepository.findById(postId)
    res.status(HTTP_STATUSES.CREATED_201).json(post);

}