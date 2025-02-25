import {body} from 'express-validator'
import { blogRepository, commentRepository, postRepository } from '../instances'
import { CodStatus } from '../types/types'
import { NextFunction, Response, Request} from 'express'
import { HTTP_STATUSES } from '../setting/setting.path.name'

export const blogIdExistValidator = body('blogId').custom(async(value) => {
                                                        if((!await blogRepository.isExist(value)))
                                                            throw new Error("BlogId isn't correct")})

export const postIdExistValidator = async (req: Request<{id: string}, any, any, any>, res: Response, next: NextFunction) =>{

    const postId = req.params.id;

    if(!await postRepository.isExist(postId)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next();
    return;
    
}

export const commentIdExistValidator = async (req: Request<{id: string}, any, any, any>, res: Response, next: NextFunction) =>{

    const commentId = req.params.id;


    if(!await commentRepository.isExist(commentId)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next();
    return;
    
}