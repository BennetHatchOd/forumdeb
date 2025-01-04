import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { paginator } from "../../../utility/paginator"; 
import { CodStatus, PaginatorType, QueryType, StatusResult } from "../../../types/types";
import { BlogInputType, BlogViewType } from "../types";
import { BlogService } from "../application/blog.service";
import { BlogQueryRepository } from "../repositories/blog.query.repository";

export class BlogControllers { 
    constructor(private blogService: BlogService, 
                private blogQueryRepository: BlogQueryRepository){
    }

    async get(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<BlogViewType> | {}>){

        try{
            const queryPaginator:  QueryType =paginator(req.query)
            const blogPaginator: PaginatorType<BlogViewType> = await this.blogQueryRepository.find(queryPaginator)
    
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){    
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }

    async getById(req: Request<{id: string}>, res: Response<BlogViewType>){
        try{
            const foundBlog: BlogViewType|null = await this.blogQueryRepository.findById(req.params.id);
            if(foundBlog){
                res.status(HTTP_STATUSES.OK_200).json(foundBlog);
                return;
            }
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

    async post(req: Request<{},{},BlogInputType>, res: Response){
        try{
            const answer: StatusResult<string | undefined>  = await this.blogService.create(req.body); 
            if(answer.codResult == CodStatus.Created){ 
                const blog: BlogViewType | null = await this.blogQueryRepository.findById(answer.data as string)
                res.status(HTTP_STATUSES.CREATED_201).json(blog)
                return;
            }
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }

    async put(req: Request<{id: string},{},BlogInputType>, res: Response){
        try{
            const answer: StatusResult  = await this.blogService.edit(req.params.id, req.body)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }
    

    async deleteById(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = (await this.blogService.delete(req.params.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }
}
  
   