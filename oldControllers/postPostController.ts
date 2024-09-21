import { Request, Response } from "express";
import { HTTP_STATUSES } from "../src/setting";
import {PostViewModel, PostInputModel, APIErrorResult } from '../src/types';
import { postRepository } from "../src/variety/posts/repositories/postRepository";
import { postService } from "../src/variety/posts/postService";
import { postQueryRepository } from "../src/variety/posts/repositories/postQueryRepository";

export const postPostController = async (req: Request<{},{},PostInputModel>, res: Response) =>{
  
    const postId: string | null = await postService.create(req.body);  
    
    if(!postId){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    
    const post: PostViewModel | null = await postQueryRepository.findById(postId)
    res.status(HTTP_STATUSES.CREATED_201).json(post);

}