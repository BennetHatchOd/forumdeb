import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import { postRepository } from "../repositories/postRepository";
import {PostInputModel, APIErrorResult } from '../../../types';

export const putPostController = async (req: Request<{id: string},{},PostInputModel>, res: Response<APIErrorResult>) =>{
    
    if(await postRepository.edit(req.params.id, req.body))
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      
}