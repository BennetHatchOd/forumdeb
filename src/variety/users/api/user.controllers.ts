import { Request, Response } from "express";
import { paginator } from "../../../utility/paginator"
import { HTTP_STATUSES } from "../../../setting/setting.path.name"
import { APIErrorResult, CodStatus, PaginatorType, QueryType, StatusResult} from "../../../types/types"
import { UserQueryRepository} from "../repositories/user.query.repository"
import { UserService } from "../application/user.service"
//import { CodStatus, StatusResult } from "../../../types/interfaces";
import { UserInputType, UserViewType } from "../types";

export class UserControllers {   

    constructor(private userService: UserService, 
                private userQueryRepository: UserQueryRepository){
    }

    async getUser(req: Request<{},{},{},QueryType>, res: Response<PaginatorType<UserViewType>>){
        try{
            const queryPaginator:  QueryType = paginator(req.query)
        
            const userPaginator: PaginatorType<UserViewType> = await this.userQueryRepository.find(queryPaginator)
            res.status(HTTP_STATUSES.OK_200).json(userPaginator)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

    async postUser(req: Request<{},{},UserInputType>, res: Response){
        try{  
            const newUserId: StatusResult<string | APIErrorResult > = await this.userService.create(req.body); 
            
            if(newUserId.codResult == CodStatus.Created){ 
                const newUser: UserViewType | null = await this.userQueryRepository.findById(newUserId.data as string)
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
    }

    async deleteUserById(req: Request<{id: string}>, res: Response){
        try{
            const answer: StatusResult = await this.userService.delete(req.params.id)
            res.sendStatus(answer.codResult);
        }
        catch(err){
            console.log(err)
            res.status(HTTP_STATUSES.ERROR_500).json({})
        }   
    }
}