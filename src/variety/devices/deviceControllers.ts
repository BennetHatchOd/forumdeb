import { HTTP_STATUSES } from "../../setting";
import { PaginatorType, QueryType } from "../../types/types";
import { PostViewType } from "../posts/types";
import { Request, Response } from "express";
import { activeSessionType, DeviceViewType } from "./types";
import { authService } from "../auth/authSevice";
import { CodStatus } from "../../types/interfaces";
import { deviceQueryRepository } from "./repositories/deviceQueryRepository";
import { deviceService } from "./deviceService";

export const deviceControllers = {   
    
    async getDevices(req: Request, res: Response<Array<DeviceViewType>>) {
        try{
            const refreshToken= req.cookies.refreshToken
            const checkToken = await authService.checkRefreshtoken(refreshToken)
            if(checkToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return;
            }
            const devices = await deviceQueryRepository.findManyByUserId(checkToken.data!.userId)
            res.status(HTTP_STATUSES.OK_200).send(devices) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async closeManySessions(req: Request, res: Response) {
        try{
            const refreshToken= req.cookies.refreshToken
            const checkToken = await authService.checkRefreshtoken(refreshToken)
            if(checkToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return;
            }
            const deleteAnswer = await deviceService.deleteOtherSessions(checkToken.data!)
            res.status(deleteAnswer.codResult).send({})
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    },

    async closeOneSession(req: Request<{deviceId: string},{},{},{}>, res: Response) {
        try{
            const refreshToken= req.cookies.refreshToken
            const checkToken = await authService.checkRefreshtoken(refreshToken)
            if(checkToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return;
            }
            const deleteAnswer = await deviceService.deleteSession(checkToken.data!.userId, req.params.deviceId)
            res.status(deleteAnswer.codResult).send({})
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }
}