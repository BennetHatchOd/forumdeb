import { Request, Response } from "express";
import { APIErrorResult, CodStatus, PaginatorType, QueryType, StatusResult } from "../../../types/types";
import { BlogPostInputType, PostInputType, PostViewType } from "../types";
import { paginator } from "../../../utility/paginator";
import { HTTP_STATUSES } from "../../../setting/setting.path.name";
import { PostService} from "../application/post.service";
import { PostQueryRepository } from "../repositories/post.query.repository";

export class PostControllers {   
    
    constructor (private postService: PostService, 
                private postQueryRepository: PostQueryRepository){
    }

    async get(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<PostViewType>>) {

        const queryPaginator:  QueryType = paginator(req.query)
        try{
            const userId = req.user?.id

            const blogPaginator: PaginatorType<PostViewType> = await this.postQueryRepository.find(queryPaginator, userId)  
            res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

    async getById(req: Request<{id: string}>, res: Response<PostViewType>){
        try{    
            const userId = req.user?.id
            
            const postId =req.params.id
            const foundPost: PostViewType | null = await this.postQueryRepository.findById(postId, userId);
            
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
                const blog: PostViewType | null = await this.postQueryRepository.findById(answer.data as string, undefined)
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
            const answer: StatusResult<APIErrorResult |{}>  = await this.postService.edit(req.params.id, req.body)  
            res.status(answer.codResult).send(answer.data)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }

    async deleteById(req: Request<{id: string}>, res: Response) {
        try{
            const answer: StatusResult = (await this.postService.delete(req.params.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500).json({})
        }    
    }

    async getByBlog(req: Request<{id: string},{},{},QueryType>, res: Response <PaginatorType<PostViewType>|{}> ){
       
        const queryPaginator: QueryType = paginator({...req.query, blogId: req.params.id})
        try{
            const userId: string|undefined = req.user?.id
            const postPaginator: PaginatorType<PostViewType> = await this.postQueryRepository.find(queryPaginator, userId)
    
            const status = (postPaginator.totalCount == 0) 
                        ?   HTTP_STATUSES.NOT_FOUND_404  
                        :   HTTP_STATUSES.OK_200
                
            res.status(status).json(postPaginator)
            return;
        }
        catch(err){
                console.log(err)
                res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }
    
    async postByBlog(req: Request<{id: string},{},BlogPostInputType>, res: Response){
        try{
            const answerCreate: StatusResult<string| APIErrorResult>  =  await this.postService.create({...req.body, blogId: req.params.id})
    
            if(answerCreate.codResult == CodStatus.Created){ 
                const postOut: PostViewType | null = await this.postQueryRepository.findById(answerCreate.data as string, undefined)
                res.status(HTTP_STATUSES.CREATED_201).json(postOut) 
                return;
            }
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json(answerCreate.data)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }

}