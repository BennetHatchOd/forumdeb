import { Request, Response } from "express";
import {HTTP_STATUSES} from '../src/setting';
import {BlogViewModel } from '../src/types';
import { blogQueryRepository } from "../src/variety/blogs/repositories/blogQueryRepository";

export const getBlogByIdController = async (req: Request<{id: string}>, res: Response<BlogViewModel | {} >) =>{
    try{
        const foundBlog: BlogViewModel|null = await blogQueryRepository.findById(req.params.id);
        if(foundBlog){
            res.status(HTTP_STATUSES.OK_200).json(foundBlog);
            return;
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({});
    }
    catch(err){
        res.status(HTTP_STATUSES.ERROR_500).json({});
    }
}