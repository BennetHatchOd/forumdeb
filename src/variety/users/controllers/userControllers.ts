import { Request, Response } from "express";
import { paginator } from "../../../modules/paginator"
import { HTTP_STATUSES } from "../../../setting"
import { APIErrorResult, PaginatorModel, QueryModel, UserInputModel, UserViewModel } from "../../../types"
import { userQueryRepository } from "../repositories/userQueryRepository"
import { userService } from "../userSevice"
import { CodStatus, StatusResult } from "../../../interfaces";

export const postControllers = {   

    async getUserController(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<UserViewModel>>){
        try{
            const queryPaginator:  QueryModel = paginator(req.query)
        
            const userPaginator: PaginatorModel<UserViewModel> = await userQueryRepository.find(queryPaginator)
        
            res.status(HTTP_STATUSES.OK_200).json(userPaginator)
        }
        catch(err){
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async postUser(req: Request<{},{},UserInputModel>, res: Response){
        try{
            const uniq: StatusResult<APIErrorResult|null> = await userService.checkUniq(req.body.login, req.body.email)
            if(uniq.codResult == CodStatus.BadRequest){
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(uniq.data)
                return;
            }
        
            const newUser = await userService.create(req.body); 
            if(newUser.data){ 
                const user: UserViewModel | null = await userQueryRepository.findById(newUser.data)
                res.status(HTTP_STATUSES.CREATED_201).json(user)
                return;
            }
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
        catch(err){
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }        
    },

    async deleteUserById(req: Request<{id: string}>, res: Response){
    
        const answer: StatusResult = (await userService.delete(req.params.id))
        res.sendStatus(answer.codResult);

    }
}