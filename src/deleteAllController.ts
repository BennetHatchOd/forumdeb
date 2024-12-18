import { Request, Response } from "express";
import { HTTP_STATUSES } from "./setting";
import { userService } from "./variety/users/userSevice";
import { postService } from "./variety/posts/postService";
import { blogService } from "./variety/blogs/blogSevice";
import { commentService } from "./variety/comments/commentSevice";
import { authService } from "./variety/auth/authSevice";
import { deviceService } from "./variety/devices/deviceService";

export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear()
    await userService.clear()
    await authService.clear()
    await commentService.clear()
    await deviceService.clear()
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}