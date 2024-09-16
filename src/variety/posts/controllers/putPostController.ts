import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import {PostInputModel, APIErrorResult } from '../../../types';
import { postService } from "../postService";

export const putPostController = async (req: Request<{id: string},{},PostInputModel>, res: Response<APIErrorResult>) =>{
    
    const status: number = await postService.edit(req.params.id, req.body)? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

    res.sendStatus(status);
      
}