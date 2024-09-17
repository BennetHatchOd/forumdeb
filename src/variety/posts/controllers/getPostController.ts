import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {PostViewModel, PaginatorModel, QueryBaseModel} from '../../../types';
import { postQueryRepository } from "../repositories/postQueryRepository";
import { paginator } from "../../../modules/paginator";

export const getPostController = async (req: Request<{},{},{},QueryBaseModel>, res: Response<PaginatorModel<PostViewModel>>) => {

    const queryPaginator:  QueryBaseModel ={
        ...paginator(req.query)
    }
      
    const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(postPaginator)

}