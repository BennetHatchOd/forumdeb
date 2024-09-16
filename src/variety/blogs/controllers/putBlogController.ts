import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import { blogService } from "../blogSevice";
import {BlogInputModel, APIErrorResult } from '../../../types';

export const putBlogController = async (req: Request<{id: string},{},BlogInputModel>, res: Response) =>{
    
    await blogService.edit(req.params.id, req.body) ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      
}
