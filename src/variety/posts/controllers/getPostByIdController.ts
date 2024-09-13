import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import {HTTP_STATUSES} from '../../../setting';
import {PostViewModel} from '../../../types';
import { postQueryRepository } from "../repositories/postQueryRepository";

export const getPostByIdController = async (req: Request<{id: string}>, res: Response<PostViewModel>) =>{
   
    
    const foundPost: PostViewModel | null = await postQueryRepository.findById(req.params.id);
    
    if(!foundPost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    
    res.status(HTTP_STATUSES.OK_200).json(foundPost);
}