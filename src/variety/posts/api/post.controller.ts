import { Request, Response } from "express";
import { APIErrorResult, CodStatus, PaginatorType, QueryType, StatusResult } from "../../../types/types";
import { PostInputType, PostViewType } from "../types";
import { paginator } from "../../../utility/paginator";
import { postQueryRepository } from "../repositories/post.query.repository";
import { HTTP_STATUSES } from "../../../setting";
import { PostService, postService } from "../application/post.service";

export class PostControllers {   
    
    constructor (private postService: PostService, 
                private postQueryRepository: postQueryRepository){
    }

    async get(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<PostViewType>>) {

        const queryPaginator:  QueryType = paginator(req.query)
        try{
            const blogPaginator: PaginatorType<PostViewType> = await postQueryRepository.find(queryPaginator)  
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

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
    }
    
    async post(req: Request<{},{},PostInputType>, res: Response){
        try{
            const answer: StatusResult<string | APIErrorResult>  = await this.postService.create(req.body); 
            if(answer.codResult == CodStatus.Created){ 
                const blog: PostViewType | null = await this.postQueryRepository.findById(answer.data as string)
                if(!blog) throw "can't find blog"
                res.status(HTTP_STATUSES.CREATED_201).json(blog)
                return;
            }
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json(answer.data)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }

    async put(req: Request<{id: string},{},PostInputType>, res: Response<APIErrorResult|{}>){
        try{     
            const answer: StatusResult  = await postService.edit(req.params.id, req.body)  
            res.status(answer.codResult).send(answer.data)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }

    async deletePostById(req: Request<{id: string}>, res: Response) {
        try{
            const answer: StatusResult = (await postService.delete(req.params.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500).json({})
        }    
    }


}