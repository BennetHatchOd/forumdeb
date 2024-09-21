import { Response, Request } from "express";
import {HTTP_STATUSES} from '../src/setting';
import {UserViewModel, PaginatorModel, QueryModel} from '../src/types';
import { userQueryRepository } from "../src/variety/users/repositories/userQueryRepository";
import { paginator } from "../src/modules/paginator";

export const getUserController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<UserViewModel>>) =>{

    const queryPaginator:  QueryModel ={
        ...paginator(req.query),
    }

    const userPaginator: PaginatorModel<UserViewModel> = await userQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(userPaginator)

}
