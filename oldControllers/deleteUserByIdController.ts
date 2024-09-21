import { Request, Response } from "express";
import {HTTP_STATUSES} from '../src/setting';
import { userService } from "../src/variety/users/userSevice";

export const deleteUserByIdController = async (req: Request<{id: string}>, res: Response) =>{
    
    await userService.delete(req.params.id) ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    
}
  
    
