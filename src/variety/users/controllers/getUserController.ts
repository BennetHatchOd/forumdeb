import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {UserViewModel, PaginatorModel, QueryUserModel} from '../../../types';
import { userQueryRepository } from "../repositories/userQueryRepository";
import { paginator } from "../../../modules/paginator";

export const getUserController = async (req: Request<{},{},{},QueryUserModel>, res: Response<PaginatorModel<UserViewModel>>) =>{

    const queryPaginator:  QueryUserModel ={
        ...paginator(req.query),
        searchEmailTerm: req.query.searchEmailTerm ? req.query.searchEmailTerm : null,
        searchLoginTerm: req.query.searchLoginTerm ? req.query.searchLoginTerm : null,
    }

    const userPaginator: PaginatorModel<UserViewModel> = await userQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(userPaginator)

}
