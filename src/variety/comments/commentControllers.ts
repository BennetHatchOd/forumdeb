import { Request, Response } from "express";
import {HTTP_STATUSES} from '../../setting';
import { paginator } from "../../utility/paginator"; 
import { CodStatus, StatusResult } from "../../types/interfaces";
import { PaginatorModel, QueryModel } from "../../types/types";
import { commentQueryRepository } from "./repositories/commentQueryRepository";
import { CommentInputModel, CommentViewModel } from "./types";
import { commentService } from "./commentSevice";

export const commentControllers ={ 
    
    
    async getCommentById(req: Request<{id: string}>, res: Response<CommentViewModel>){
        try{
            const foundItem: CommentViewModel|null = await commentQueryRepository.findById(req.params.id);
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
    },

    
    async putComment(req: Request<{id: string},{},CommentInputModel>, res: Response){
        try{
            const answer: StatusResult  = await commentService.edit(req.params.id, req.user!.id, req.body)  
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },
    
    
    async deleteComment(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = (await commentService.delete(req.params.id, req.user!.id))
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({});
        }
    },
    
    async getCommentToPost(req: Request<{id: string},{},{},QueryModel>, res: Response <PaginatorModel<CommentViewModel>|{}> ){
        
        const queryPaginator: QueryModel = paginator(req.query)
        try{
            const commentPaginator: PaginatorModel<CommentViewModel> = await commentQueryRepository.find(req.params.id, queryPaginator)
            
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
    },

    async postCommentToPost(req: Request<{id: string},{},CommentInputModel>, res: Response){

        try{
            const answerCreate: StatusResult<string|undefined>  =  await commentService.create(req.params.id, req.user!.id, req.body)
  
            if(answerCreate.codResult == CodStatus.Created){ 
                const commentOut: CommentViewModel | null = await commentQueryRepository.findById(answerCreate.data!)
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
    },
    
    
    // async getComment(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<CommentViewModel> | {}>){
    
    // async postComment(req: Request<{},{},CommentInputModel>, res: Response){
    //     try{
    //         const answer: StatusResult<string | undefined>  = await commentService.create(req.body); 
    //         if(answer.codResult == CodStatus.Created){ 
    //             const comment: CommentViewModel | null = await commentQueryRepository.findById(answer.data as string)

    //     try{
    //         const queryPaginator:  QueryModel =paginator(req.query)
    //         const commentPaginator: PaginatorModel<CommentViewModel> = await commentQueryRepository.find(queryPaginator)
    
    //         res.status(HTTP_STATUSES.OK_200).json(commentPaginator)
    //     }
    //     catch(err){    
    //         console.log(err)
    //         res.status(HTTP_STATUSES.ERROR_500).json({});
    //     }
    // },
    //             res.status(HTTP_STATUSES.CREATED_201).json(comment)
    //             return;
    //         }
    //         res.status(HTTP_STATUSES.ERROR_500).json({})
    //     }
    //     catch(err){
    //         console.log(err)
    //         res.status(HTTP_STATUSES.ERROR_500).json({})
    //     }
    
} 
  
   