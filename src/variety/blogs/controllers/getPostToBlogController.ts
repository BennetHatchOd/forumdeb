import { Request, Response } from 'express'
import { postCollection } from '../../../db/db'
import { ObjectId, SortDirection } from 'mongodb'
import { postRepository } from '../../posts/repositories/postRepository'
import { PostViewModel, PaginatorModel, QueryModel } from '../../../types'
import { postQueryRepository } from '../../posts/repositories/postQueryRepository'
export const getPostToBlogController = async(req: Request<{id: string}>, res: Response) => {

    export const getPostToBlogController = async (req: Request<{id: string}>, res: Response < PaginatorModel < PostViewModel >> ) =>{
   
       const queryPaginator: QueryModel = {
        searchNameTerm: null,
        blogId: req.params.id,
        sortBy: req.query.sortBy ? req.query.sortBy as string : 'createdAt',
        sortDirection: req.query.SortDirection ? req.query.SortDirection as SortDirection: 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
       }
       
       const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)
       
       
       
       
    //     const foundBlog: BlogViewModel|null = await blogQueryRepos.findById(req.params.id);
    //     if(!foundBlog)
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    //     else
    //         res.status(HTTP_STATUSES.OK_200).json(foundBlog);
    // }
}