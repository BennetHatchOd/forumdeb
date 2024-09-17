import { Response, Request } from "express";
import { paginator } from "../../../modules/paginator"; 
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel, PaginatorModel, QueryBlogModel} from '../../../types';
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const getBlogController = async (req: Request<{},{},{},QueryBlogModel>, res: Response<PaginatorModel<BlogViewModel>>) =>{

    const queryPaginator:  QueryBlogModel ={
        ...paginator(req.query),
        searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null,
    }

    const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(blogPaginator)

}


