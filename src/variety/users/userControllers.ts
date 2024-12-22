import { Request, Response } from "express";
import { paginator } from "../../utility/paginator"
import { HTTP_STATUSES } from "../../setting"
import { APIErrorResult, PaginatorType, QueryType} from "../../types/types"
import { userQueryRepository } from "./repositories/userQueryRepository"
import { userService } from "./userSevice"
import { CodStatus, StatusResult } from "../../types/interfaces";
import { UserInputType, UserViewType } from "./types";

export const userControllers = {   

    async getUser(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<UserViewType>>){
        try{
            const queryPaginator:  QueryType = paginator(req.query)
        
            const userPaginator: PaginatorType<UserViewType> = await userQueryRepository.find(queryPaginator)
            res.status(HTTP_STATUSES.OK_200).json(userPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async postUser(req: Request<{},{},UserInputType>, res: Response){
        try{  
            const newUserId: StatusResult<string | APIErrorResult | undefined> = await userService.create(req.body); 
            
            if(newUserId.codResult == CodStatus.Created){ 
                const newUser: UserViewType | null = await userQueryRepository.findById(newUserId.data as string)
                if(newUser){ 
                    res.status(HTTP_STATUSES.CREATED_201).json(newUser)
                    return;
                }
                throw 'cannot read created user'
            }
            res.status(newUserId.codResult).json(newUserId.data)
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }        
    },

    async deleteUserById(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = await userService.delete(req.params.id)
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }   
    }
}