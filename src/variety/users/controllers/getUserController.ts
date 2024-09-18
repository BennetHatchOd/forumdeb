import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {UserViewModel, PaginatorModel, QueryModel} from '../../../types';
import { userQueryRepository } from "../repositories/userQueryRepository";
import { paginator } from "../../../modules/paginator";

export const getUserController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<UserViewModel>>) =>{

    const queryPaginator:  QueryModel ={
        ...paginator(req.query),
    }

    const userPaginator: PaginatorModel<UserViewModel> = await userQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(userPaginator)

}
