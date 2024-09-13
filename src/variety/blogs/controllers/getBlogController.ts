import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel, PaginatorModel, QueryModel} from '../../../types';
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const getBlogController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<BlogViewModel>>) =>{

    const queryPaginator:  QueryModel ={
        blogId: null,
        searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null,
        sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }
      
    const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(blogPaginator)

}
