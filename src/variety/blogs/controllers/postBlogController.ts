import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import {BlogViewModel, BlogInputModel, APIErrorResult } from '../../../types';
import { blogService } from "../blogSevice";
import { blogQueryRepository } from "../repositories/blogQueryRepository";



export const postBlogController = async (req: Request<{},{},BlogInputModel>, res: Response) =>{
    
    const idBlog: string | null = await blogService.create(req.body); 
    if(idBlog){ 
        const blog: BlogViewModel | null = await blogQueryRepository.findById(idBlog)
        res.status(HTTP_STATUSES.CREATED_201).json(blog)
        return;
    }
    res.sendStatus(HTTP_STATUSES.ERROR_500)
}
