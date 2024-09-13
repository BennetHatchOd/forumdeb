import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import {PostViewModel, PostInputModel, APIErrorResult } from '../../../types';
import { postRepository } from "../repositories/postRepository";

export const postPostController = async (req: Request<{},{},PostInputModel>, res: Response<PostViewModel|APIErrorResult>) =>{
  
    const post: PostViewModel | null = await postRepository.create(req.body);  
    if(post){
        res.status(HTTP_STATUSES.CREATED_201).json(post);
        return;
    }
    
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

}