import { Request, Response } from "express";

import { HTTP_STATUSES } from "../setting";
import { blogService } from "../variety/blogs/blogSevice";
import { postService } from "../variety/posts/postService";
import { userService } from "../variety/users/userSevice";
import { LoginInputModel } from "../types";

export const authLoginController = async (req: Request<{},{},LoginInputModel>, res: Response) =>{
    
    if(userService.isValid(req.body.loginOrEmail, req.body.password) !== true){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const status: number = await userService.authUser(req.body.loginOrEmail, req.body.password) ? HTTP_STATUSES.CREATED_201 : HTTP_STATUSES.NO_AUTHOR_401
    
    res.sendStatus(status);

}