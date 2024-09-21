import { Request, Response } from "express";
import { HTTP_STATUSES } from "../src/setting";
import {BlogViewModel, BlogInputModel, APIErrorResult } from '../src/types';
import { blogService } from "../src/variety/blogs/blogSevice";
import { blogQueryRepository } from "../src/variety/blogs/repositories/blogQueryRepository";
import { StatusResult } from "../src/interfaces";



export const postBlogController = async (req: Request<{},{},BlogInputModel>, res: Response) =>{
    try{
        const answer: StatusResult<string | null>  = await blogService.create(req.body); 
        if(answer.success){ 
            const blog: BlogViewModel | null = await blogQueryRepository.findById(answer.data as string)
            res.status(HTTP_STATUSES.CREATED_201).json(blog)
            return;
        }
        res.status(HTTP_STATUSES.ERROR_500).json({})
    }
    catch(err){
        res.status(HTTP_STATUSES.ERROR_500).json({})
    }
}
