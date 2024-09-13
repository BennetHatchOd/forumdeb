import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel, PaginatorModel, QueryModel} from '../../../types';
import { blogService } from "../blogSevice";
import { blogQueryRepository } from "../repositories/blogQueryRepository";

export const getBlogController = async (req: Request<{},{},{},QueryModel>, res: Response<BlogViewModel []>) =>{

    const queryReq:  QueryModel ={
        blogId: null,
        searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null,
        sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }
    const blogs:  PaginatorModel<BlogViewModel> = await blogQueryRepository.find(queryReq);
    
    if(blogs)
        res.status(HTTP_STATUSES.OK_200).json(blogs);


}
