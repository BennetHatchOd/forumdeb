import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { postService } from "../postService";

export const deletePostByIdController = async (req: Request<{id: string}>, res: Response) =>{
    
    if(await postService.delete(req.params.id))
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }