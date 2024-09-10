import { Request, Response } from "express";
import { HTTP_STATUSES, SETTING } from "../../../setting";
import {BlogViewModel, BlogInputModel, APIErrorResult } from '../../../types';
import { blogRepository } from "../repositories/index";



export const postBlogController = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel|APIErrorResult>) =>{
    
    const blog: BlogViewModel | null = await blogRepository.create(req.body);  
    if (blog)
        res.status(HTTP_STATUSES.CREATED_201).json(blog);
    else
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
}
