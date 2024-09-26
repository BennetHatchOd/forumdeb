import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { postService } from "../postService";
import { CodStatus, StatusResult } from "../../../interfaces";
import { APIErrorResult, PaginatorModel, PostInputModel, PostViewModel, QueryModel } from "../../../types";
import { postQueryRepository } from "../repositories/postQueryRepository";
import { paginator } from "../../../modules/paginator";

export const postControllers = {   
    
    async getPost(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<PostViewModel>>) {

        const queryPaginator:  QueryModel = paginator(req.query)
        try{
            const blogPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)  
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async getPostById(req: Request<{id: string}>, res: Response<PostViewModel>){
        try{    
            const foundPost: PostViewModel | null = await postQueryRepository.findById(req.params.id);
            
            if(!foundPost){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            
            res.status(HTTP_STATUSES.OK_200).json(foundPost);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },
    
    async postPost(req: Request<{},{},PostInputModel>, res: Response){
        try{
            const answer: StatusResult<string | undefined>  = await postService.create(req.body); 
            if(answer.codResult == CodStatus.Created){ 
                const blog: PostViewModel | null = await postQueryRepository.findById(answer.data as string)
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


    async putPost(req: Request<{id: string},{},PostInputModel>, res: Response<APIErrorResult|{}>){
        try{     
            const answer: StatusResult  = await postService.edit(req.params.id, req.body)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    },

    async deletePostById(req: Request<{id: string}>, res: Response) {
        try{
            const answer: StatusResult = (await postService.delete(req.params.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500).json({})
        }    
    },


}