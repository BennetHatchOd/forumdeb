import { Request, Response } from "express"
import { BlogViewModel, PostInputModel, PostViewModel } from "../../../types"
import { blogQueryRepository } from "../repositories/blogQueryRepository"
import { HTTP_STATUSES } from "../../../setting"
import { postService } from "../../posts/postService"

type PostInputShortModel = {
    title:	string,
    shortDescription: string,
    content: string,
}

export const postPostToBlogController = async (req: Request<{id: string},{},PostInputShortModel>, res: Response): Promise<void> => {

    const parentBlog: BlogViewModel | null = await blogQueryRepository.findById(req.params.id)

    if (parentBlog == null){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
 
    const postOut: PostViewModel | null =  await postService.create({...req.body, blogId: parentBlog.id})

    postOut ? res.status(HTTP_STATUSES.OK_200).json(postOut) : res.sendStatus(HTTP_STATUSES.ERROR_500)
}


