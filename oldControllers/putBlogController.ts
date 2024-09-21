import { Request, Response } from "express";
import { HTTP_STATUSES } from "../src/setting";
import { blogService } from "../src/variety/blogs/blogSevice";
import {BlogInputModel, APIErrorResult } from '../src/types';
import { StatusResult } from "../src/interfaces";

export const putBlogController = async (req: Request<{id: string},{},BlogInputModel>, res: Response) =>{
    
    const answer: StatusResult  = await blogService.edit(req.params.id, req.body) 
    
    
    answer.success ? 
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) 
      : res.sendStatus(answer.codResult as number);
      
}
