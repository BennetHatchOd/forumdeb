import { Request, Response } from "express"
import { BlogViewModel, PostInputModel, PostViewModel } from "../../../types"
import { blogQueryRepository } from "../repositories/blogQueryRepository"
import { HTTP_STATUSES } from "../../../setting"
import { postService } from "../../posts/postService"
import { postQueryRepository } from "../../posts/repositories/postQueryRepository"

type PostInputShortModel = {
    title:	string,
    shortDescription: string,
    content: string,
}

export const postPostToBlogController = async (req: Request<{id: string},{},PostInputShortModel>, res: Response) => {

 
    const idOut: string | null =  await postService.create({...req.body, blogId: req.params.id})

    if(!idOut){
        res.status(HTTP_STATUSES.ERROR_500).json({})
        return;
    }
    const postOut: PostViewModel | null = await postQueryRepository.findById(idOut)
    res.status(HTTP_STATUSES.OK_200).json(postOut) 
}


