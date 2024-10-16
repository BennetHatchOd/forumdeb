import { Request, Response } from "express";
import { HTTP_STATUSES } from "./setting";
import { userService } from "./variety/users/userSevice";
import { postService } from "./variety/posts/postService";
import { blogService } from "./variety/blogs/blogSevice";
import { commentService } from "./variety/comments/commentSevice";
import { authService } from "./variety/auth/authSevice";

export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear()
    await userService.clear()
    await authService.clear()
    await commentService.clear()
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}