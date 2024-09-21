import { Request, Response } from 'express'
import { postCollection } from '../src/db/db'
import { ObjectId, SortDirection } from 'mongodb'
import { postRepository } from '../src/variety/posts/repositories/postRepository'
import { PostViewModel, PaginatorModel, QueryModel } from '../src/types'
import { postQueryRepository } from '../src/variety/posts/repositories/postQueryRepository'
import { HTTP_STATUSES } from '../src/setting'
import { paginator } from '../src/modules/paginator'


export const getPostToBlogController = async (req: Request<{id: string},{},{},QueryModel>, res: Response < PaginatorModel < PostViewModel > | {}> ) =>{
   
       const queryPaginator: QueryModel = {
              ...paginator(req.query),
       }
       try{
              const postPaginator: PaginatorModel<PostViewModel> = await postQueryRepository.find(queryPaginator)

              const status = postPaginator.totalCount == 0 ? 
                            HTTP_STATUSES.NOT_FOUND_404 : 
                            HTTP_STATUSES.OK_200
              
              res.status(status).json(postPaginator)
              return;
       }
       catch(err){
           res.status(HTTP_STATUSES.ERROR_500).json({});
       }
}