import { Request, Response } from "express";

import { HTTP_STATUSES } from "./setting";
import { blogRepository } from "./variety/blogs/repositories/index";
import { postRepository } from "./variety/posts/repositories/index";

export const deleteAllController = async (req: Request, res: Response) =>{
    console.log('delete all')
    await blogRepository.clear()
    await postRepository.clear();
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}