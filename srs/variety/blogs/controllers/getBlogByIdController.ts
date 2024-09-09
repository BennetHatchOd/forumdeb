import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel } from '../../../types';
import { blogRepository } from "../repositories/index"; 

export const getBlogByIdController = async (req: Request<{id: string}>, res: Response<BlogViewModel >) =>{
   
    const foundBlog: BlogViewModel|null = await blogRepository.find(req.params.id);
    if(!foundBlog)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    else
        res.status(HTTP_STATUSES.OK_200).json(foundBlog);
}