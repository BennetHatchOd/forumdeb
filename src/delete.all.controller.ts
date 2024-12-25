import { Request, Response } from "express";
import { HTTP_STATUSES } from "./setting";
import { userService } from "./variety/users/application/user.service";
import { postService } from "./variety/posts/application/post.service";
import { blogService } from "./variety/blogs/application/blog.service";
import { commentService } from "./variety/comments/application/comment.service";
import { authService } from "./variety/auth/application/auth.service";
import { deviceService } from "./variety/devices/application/device.service";

export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear()
    await userService.clear()
    await authService.clear()
    await commentService.clear()
    await deviceService.clear()
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}