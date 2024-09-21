import { Response, Request } from "express";
import { paginator } from "../src/modules/paginator"; 
import {HTTP_STATUSES} from '../src/setting';
import {BlogViewModel, PaginatorModel, QueryModel} from '../src/types';
import { blogQueryRepository } from "../src/variety/blogs/repositories/blogQueryRepository";

export const getBlogController = async (req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<BlogViewModel> | {}>) =>{

    const queryPaginator:  QueryModel ={
        ...paginator(req.query),
        
    }
    try{
        const blogPaginator: PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryPaginator)

        res.status(HTTP_STATUSES.OK_200).json(blogPaginator)
    }
    catch(err){
        res.status(HTTP_STATUSES.ERROR_500).json({});
    }
}


