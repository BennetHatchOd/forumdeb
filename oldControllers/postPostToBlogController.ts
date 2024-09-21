import { Request, Response } from "express"
import { BlogPostInputModel, PostViewModel } from "../src/types"
import { blogQueryRepository } from "../src/variety/blogs/repositories/blogQueryRepository"
import { HTTP_STATUSES } from "../src/setting"
import { postService } from "../src/variety/posts/postService"
import { postQueryRepository } from "../src/variety/posts/repositories/postQueryRepository"
import { StatusResult } from "../src/interfaces"

export const postPostToBlogController = async (req: Request<{id: string},{},BlogPostInputModel>, res: Response) => {

    try{
        const answer: StatusResult<string | null>  =  await postService.create({...req.body, blogId: req.params.id})

        if(answer.success){ 
            const postOut: PostViewModel | null = await postQueryRepository.findById(answer.data as string)
            res.status(HTTP_STATUSES.CREATED_201).json(postOut) 
            return;
        }
        res.status(answer.codResult as number).json({})
    }
    catch(err){
        res.status(HTTP_STATUSES.ERROR_500).json({})
    }

}


