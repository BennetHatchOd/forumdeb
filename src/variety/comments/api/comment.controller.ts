import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../../setting/setting.path.name';
import { paginator } from "../../../utility/paginator"; 
import { CodStatus, PaginatorType, QueryType, StatusResult } from "../../../types/types";
import { CommentInputType, CommentViewType } from "../types";
import { CommentService } from "../application/comment.service";
import { CommentQueryRepository } from "../repositories/comment.query.repository";

export class CommentControllers { 

    constructor(private commentQueryRepository: CommentQueryRepository,  
                private commentService: CommentService){
    }

    async getCommentById(req: Request<{id: string}>, res: Response<CommentViewType>){
        try{
            const foundItem: CommentViewType|null = await this.commentQueryRepository.findById(req.params.id);
            if(foundItem){
                res.status(HTTP_STATUSES.OK_200).json(foundItem);
                return;
            }
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }
    
    async putComment(req: Request<{id: string},{},CommentInputType>, res: Response){
        try{
            const answer: StatusResult  = await this.commentService.edit(req.params.id, req.user!.id, req.body)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }    
    
    async deleteComment(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = (await this.commentService.delete(req.params.id, req.user!.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }
    
    async getCommentToPost(req: Request<{id: string},{},{},QueryType>, res: Response <PaginatorType<CommentViewType>|{}> ){
        
        const queryPaginator: QueryType = paginator(req.query)
        try{
            const commentPaginator: PaginatorType<CommentViewType> = await this.commentQueryRepository.find(req.params.id, queryPaginator)
            
            const status = commentPaginator.totalCount == 0 
            ?   HTTP_STATUSES.NOT_FOUND_404  
            :   HTTP_STATUSES.OK_200
            
            res.status(status).json(commentPaginator)
            return;
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    }

    async postCommentToPost(req: Request<{id: string},{},CommentInputType>, res: Response){

        try{
            const answerCreate: StatusResult<string|undefined>  =  await this.commentService.create(req.params.id, req.user!.id, req.body)
  
            if(answerCreate.codResult == CodStatus.Created){ 
                const commentOut: CommentViewType | null = await this.commentQueryRepository.findById(answerCreate.data!)
                if(!commentOut) throw 'commentQueryRepository didn\'t find comment'
                res.status(HTTP_STATUSES.CREATED_201).json(commentOut) 
                return;
            }
            res.status(answerCreate.codResult).json({})
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }
    }     

} 
  
   