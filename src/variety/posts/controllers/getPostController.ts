import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {PostViewModel, PaginatorModel, QueryModel} from '../../../types';
import { postQueryRepository } from "../repositories/postQueryRepository";

export const getPostController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<PostViewModel>>) =>{

    const queryPaginator:  QueryModel ={
        blogId: null,
        searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null,
        sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }
      
    const blogPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(blogPaginator)

}