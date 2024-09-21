import { Request, Response } from "express";
import {HTTP_STATUSES} from '../src/setting';
import { blogService } from "../src/variety/blogs/blogSevice";
import { paginator } from "../src/modules/paginator"; 
import { StatusResult } from "../src/interfaces";
import { BlogInputModel, BlogPostInputModel, BlogViewModel, PaginatorModel, PostViewModel, QueryModel } from "../src/types";
import { postService } from "../src/variety/posts/postService";
import { postQueryRepository } from "../src/variety/posts/repositories/postQueryRepository";
import { blogQueryRepository } from "../src/variety/blogs/repositories/blogQueryRepository";

export const blogControllers ={ 

    async deleteBlogById(req: Request<{id: string}>, res: Response){
    
        const answer: StatusResult = (await blogService.delete(req.params.id))
        res.sendStatus(answer.codResult);
    },

    async putBlog(req: Request<{id: string},{},BlogInputModel>, res: Response){
    
        const answer: StatusResult  = await blogService.edit(req.params.id, req.body)  
        res.sendStatus(answer.codResult);

    },

    async postPostToBlog(req: Request<{id: string},{},BlogPostInputModel>, res: Response){

      try{
          const answerCreate: StatusResult<string>  =  await postService.create({...req.body, blogId: req.params.id})
  
          if(answer.success){ 
              const postOut: PostViewModel | null = await postQueryRepository.findById(answer.data as string)
              res.status(HTTP_STATUSES.CREATED_201).json(postOut) 
              return;
          }
          res.status(answer.codResult as number).json({})
      }
      catch(err){
          res.status(HTTP_STATUSES.ERROR_500).json({})
      }
    },

    async postBlog(req: Request<{},{},BlogInputModel>, res: Response){
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
    },

    async getPostToBlog(req: Request<{id: string},{},{},QueryModel>, res: Response <PaginatorModel<PostViewModel>|{}> ){
   
      const queryPaginator: QueryModel = {
             ...paginator(req.query),
      }
      try{
             const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

             const status = postPaginator.totalCount == 0 ? 
                           HTTP_STATUSES.NOT_FOUND_404 : 
                           HTTP_STATUSES.OK_200
             
             res.status(status).json(postPaginator)
             return;
      }
      catch(err){
          res.status(HTTP_STATUSES.ERROR_500).json({});
      }
    },

    async getBlog(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<BlogViewModel> | {}>){

        const queryPaginator:  QueryModel ={
            ...paginator(req.query),
            
        }
        try{
            const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)
    
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },

    async getBlogById(req: Request<{id: string}>, res: Response<BlogViewModel | {} >){
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

}
  
   