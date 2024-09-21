import { Response, Request } from "express";
import {HTTP_STATUSES} from '../src/setting';
import {PostViewModel, PaginatorModel, QueryModel} from '../src/types';
import { postQueryRepository } from "../src/variety/posts/repositories/postQueryRepository";
import { paginator } from "../src/modules/paginator";

export const getPostController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<PostViewModel>>) => {

    const queryPaginator:  QueryModel ={
        ...paginator(req.query)
    }
      
    const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(postPaginator)

}