import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { blogService } from "../blogSevice";

export const deleteBlogByIdController = async (req: Request<{id: string}>, res: Response) =>{
    
    await blogService.delete(req.params.id) ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    
}
  
    
