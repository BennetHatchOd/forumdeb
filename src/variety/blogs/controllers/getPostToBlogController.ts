import { Request, Response } from 'express'
import { postCollection } from '../../../db/db'
import { ObjectId, SortDirection } from 'mongodb'
import { postRepository } from '../../posts/repositories/postRepository'
import { PostViewModel, PaginatorModel, QueryModel } from '../../../types'
import { postQueryRepository } from '../../posts/repositories/postQueryRepository'
import { HTTP_STATUSES } from '../../../setting'


export const getPostToBlogController = async (req: Request<{id: string},{},{},QueryModel>, res: Response < PaginatorModel < PostViewModel >> ) =>{
   
       const queryPaginator: QueryModel = {
        searchNameTerm: null,
        blogId: req.params.id,
        sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
       }
       console.log(queryPaginator)
       const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

       const status = postPaginator.totalCount == 0 ? HTTP_STATUSES.NOT_FOUND_404 : HTTP_STATUSES.OK_200
       
       res.status(status).json(postPaginator)
       
}