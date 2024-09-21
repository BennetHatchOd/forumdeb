import { Request, Response } from "express";
import {HTTP_STATUSES} from '../src/setting';
import {PostViewModel} from '../src/types';
import { postQueryRepository } from "../src/variety/posts/repositories/postQueryRepository";

export const getPostByIdController = async (req: Request<{id: string}>, res: Response<PostViewModel>) =>{
   
    
    const foundPost: PostViewModel | null = await postQueryRepository.findById(req.params.id);
    
    if(!foundPost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    
    res.status(HTTP_STATUSES.OK_200).json(foundPost);
}