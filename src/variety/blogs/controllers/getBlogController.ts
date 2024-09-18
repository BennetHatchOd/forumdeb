import { Response, Request } from "express";
import { paginator } from "../../../modules/paginator"; 
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel, PaginatorModel, QueryModel} from '../../../types';
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const getBlogController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<BlogViewModel>>) =>{

    const queryPaginator:  QueryModel ={
        ...paginator(req.query),
        
    }

    const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)

    res.status(HTTP_STATUSES.OK_200).json(blogPaginator)

}


