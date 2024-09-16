import { Request, Response } from "express"
import { BlogPostInputModel, PostViewModel } from "../../../types"
import { blogQueryRepository } from "../repositories/blogQueryRepository"
import { HTTP_STATUSES } from "../../../setting"
import { postService } from "../../posts/postService"
import { postQueryRepository } from "../../posts/repositories/postQueryRepository"

export const postPostToBlogController = async (req: Request<{id: string},{},BlogPostInputModel>, res: Response) => {

 
    const idOut: string | null =  await postService.create({...req.body, blogId: req.params.id})

    if(!idOut){
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({})
        return;
    }
    const postOut: PostViewModel | null = await postQueryRepository.findById(idOut)
    res.status(HTTP_STATUSES.CREATED_201).json(postOut) 
}


