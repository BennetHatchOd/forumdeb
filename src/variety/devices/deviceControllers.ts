import { HTTP_STATUSES } from "../../setting";
import { PaginatorModel, QueryModel } from "../../types/types";
import { PostViewModel } from "../posts/types";
import { Request, Response } from "express";
import { DeviceViewModel } from "./types";

export const deviceControllers = {   
    
    async getDevices(req: Request, res: Response<Array<DeviceViewModel>>) {
        try{
            //    
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async closeManySessions(req: Request, res: Response) {
        try{

        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async closeOneSession(req: Request<{},{},{},QueryModel>, res: Response<PaginatorModel<PostViewModel>>) {
        try{
 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }
}