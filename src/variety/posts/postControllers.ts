import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../setting';
import { postService } from "./postService";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { APIErrorResult, PaginatorType, QueryType } from "../../types/types";
import { postQueryRepository } from "./repositories/postQueryRepository";
import { paginator } from "../../utility/paginator";
import { PostInputType, PostViewType } from "./types";

export const postControllers = {   
    
    async getPost(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<PostViewType>>) {

        const queryPaginator:  QueryType = paginator(req.query)
        try{
            const blogPaginator: PaginatorType<PostViewType> = await postQueryRepository.find(queryPaginator)  
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async getPostById(req: Request<{id: string}>, res: Response<PostViewType>){
        try{    
            const foundPost: PostViewType | null = await postQueryRepository.findById(req.params.id);
            
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
    
    async postPost(req: Request<{},{},PostInputType>, res: Response){
        try{
            const answer: StatusResult<string | undefined>  = await postService.create(req.body); 
            if(answer.codResult == CodStatus.Created){ 
                const blog: PostViewType | null = await postQueryRepository.findById(answer.data as string)
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


    async putPost(req: Request<{id: string},{},PostInputType>, res: Response<APIErrorResult|{}>){
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