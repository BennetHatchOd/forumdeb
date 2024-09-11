import { Request, Response } from "express";

import { HTTP_STATUSES } from "../setting";
import { blogService } from "../variety/blogs/blogSevice";
import { postService } from "../variety/posts/postService";

export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear();
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}