import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { blogService } from "../blogSevice";
import { paginator } from "../../../modules/paginator"; 
import { CodStatus, StatusResult } from "../../../interfaces";
import { BlogInputModel, BlogPostInputModel, BlogViewModel, PaginatorModel, PostViewModel, QueryModel } from "../../../types";
import { postService } from "../../posts/postService";
import { postQueryRepository } from "../../posts/repositories/postQueryRepository";
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const blogControllers ={ 
    
    async getBlog(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<BlogViewModel> | {}>){

        try{
            const queryPaginator:  QueryModel =paginator(req.query)
            const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)
    
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },

    async getBlogById(req: Request<{id: string}>, res: Response<BlogViewModel>){
        try{
            const foundBlog: BlogViewModel|null = await blogQueryRepository.findById(req.params.id);
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
    },

    async postBlog(req: Request<{},{},BlogInputModel>, res: Response){
        try{
            const answer: StatusResult<string | undefined>  = await blogService.create(req.body); 
            if(answer.codResult == CodStatus.Created){ 
                const blog: BlogViewModel | null = await blogQueryRepository.findById(answer.data as string)
                res.status(HTTP_STATUSES.CREATED_201).json(blog)
                return;
            }
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    },

    async putBlog(req: Request<{id: string},{},BlogInputModel>, res: Response){
        try{
            const answer: StatusResult  = await blogService.edit(req.params.id, req.body)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },
    

    async deleteBlogById(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = (await blogService.delete(req.params.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },

    async getPostByBlog(req: Request<{id: string},{},{},QueryModel>, res: Response <PaginatorModel<PostViewModel>|{}> ){
   
        const queryPaginator: QueryModel = paginator({...req.query, blogId: req.params.id})
        try{
            const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

            const status = postPaginator.totalCount == 0 
                        ?   HTTP_STATUSES.NOT_FOUND_404  
                        :   HTTP_STATUSES.OK_200
             
            res.status(status).json(postPaginator)
            return;
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },

    async postPostByBlog(req: Request<{id: string},{},BlogPostInputModel>, res: Response){

        try{
            const answerCreate: StatusResult<string|undefined>  =  await postService.create({...req.body, blogId: req.params.id})
  
            if(answerCreate.codResult == CodStatus.Created){ 
                const postOut: PostViewModel | null = await postQueryRepository.findById(answerCreate.data as string)
                res.status(HTTP_STATUSES.CREATED_201).json(postOut) 
                return;
            }
            res.status(answerCreate.codResult).json({})
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    },



}
  
   