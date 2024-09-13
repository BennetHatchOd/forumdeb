import { Request, Response } from "express";

import { HTTP_STATUSES } from "../setting";
import { blogService } from "../variety/blogs/blogSevice";
import { postService } from "../variety/posts/postService";

export const testGet = async (req: Request, res: Response) =>{
    
    
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}