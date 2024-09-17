import { Request, Response } from "express";

import { HTTP_STATUSES } from "../setting";
import { blogService } from "../variety/blogs/blogSevice";
import { postService } from "../variety/posts/postService";
import { userService } from "../variety/users/userSevice";

export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear();
    await userService.clear();
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}