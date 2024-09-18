import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {PostViewModel, PaginatorModel, QueryModel} from '../../../types';
import { postQueryRepository } from "../repositories/postQueryRepository";
import { paginator } from "../../../modules/paginator";

export const getPostController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<PostViewModel>>) => {

    const queryPaginator:  QueryModel ={
        ...paginator(req.query)
    }
      
    const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(postPaginator)

}