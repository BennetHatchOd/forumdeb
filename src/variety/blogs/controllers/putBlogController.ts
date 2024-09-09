import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import { blogRepository } from "../repositories/index";
import {BlogInputModel, APIErrorResult } from '../../../types';

export const putBlogController = async (req: Request<{id: string},{},BlogInputModel>, res: Response<APIErrorResult>) =>{
    
    if(await blogRepository.edit(req.params.id, req.body))
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      
}
