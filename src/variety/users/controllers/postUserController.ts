import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../setting";
import {UserViewModel, UserInputModel, APIErrorResult } from '../../../types';
import { userService } from "../userSevice";
import { userQueryRepository } from "../repositories/userQueryRepository";

export const postUserController = async (req: Request<{},{},UserInputModel>, res: Response) =>{
    
    const uniq: APIErrorResult| null = await userService.checkUniq(req.body.login, req.body.email)
    if(!uniq){
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json(uniq)
        return;
    }

    const idUser: string | null = await userService.create(req.body); 
    if(idUser){ 
        const user: UserViewModel | null = await userQueryRepository.findById(idUser)
        res.status(HTTP_STATUSES.CREATED_201).json(user)
        return;
    }
    res.sendStatus(HTTP_STATUSES.ERROR_500)
}
