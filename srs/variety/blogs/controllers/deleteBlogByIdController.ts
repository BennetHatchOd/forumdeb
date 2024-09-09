import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { blogRepository } from "../repositories/index";

export const deleteBlogByIdController = async (req: Request<{id: string}>, res: Response) =>{
    
    if(await blogRepository.delete(req.params.id))
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  
    
