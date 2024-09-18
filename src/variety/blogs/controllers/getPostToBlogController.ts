import { Request, Response } from 'express'
import { postCollection } from '../../../db/db'
import { ObjectId, SortDirection } from 'mongodb'
import { postRepository } from '../../posts/repositories/postRepository'
import { PostViewModel, PaginatorModel, QueryModel } from '../../../types'
import { postQueryRepository } from '../../posts/repositories/postQueryRepository'
import { HTTP_STATUSES } from '../../../setting'
import { paginator } from '../../../modules/paginator'


export const getPostToBlogController = async (req: Request<{id: string},{},{},QueryModel>, res: Response < PaginatorModel < PostViewModel >> ) =>{
   
       const queryPaginator: QueryModel = {
              ...paginator(req.query),
              // blogId: req.params.id,
       }
       const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

       const status = postPaginator.totalCount == 0 ? HTTP_STATUSES.NOT_FOUND_404 : HTTP_STATUSES.OK_200
       
       res.status(status).json(postPaginator)
       
}