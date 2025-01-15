import { Request, Response } from "express";
import { HTTP_STATUSES } from "./setting/setting.path.name";
import { authService, blogService, commentService, deviceService, postService, userService } from "./instances";


export const deleteAllController = async (req: Request, res: Response) =>{
    
    await blogService.clear()
    await postService.clear()
    await userService.clear()
    await commentService.clear()
    await deviceService.clear()
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

}