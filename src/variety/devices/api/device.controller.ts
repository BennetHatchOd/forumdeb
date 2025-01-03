import { HTTP_STATUSES } from "../../../setting";
import { CodStatus} from "../../../types/types";
import { Request, Response } from "express";
import { DeviceViewType } from "../types";
import { AuthService} from "../../auth/application/auth.service";
import { DeviceQueryRepository} from "../repositories/device.query.repository";
import { DeviceService} from "../application/device.service";

export class DeviceControllers {   

    constructor(private authService: AuthService,
                private deviceQueryRepository: DeviceQueryRepository, 
                private deviceService: DeviceService){

    }
    
    async getDevices(req: Request, res: Response<Array<DeviceViewType>>) {
        try{
            const devices = await this.deviceQueryRepository.findManyByUserId(req.payload!.id)
            res.status(HTTP_STATUSES.OK_200).send(devices) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

    async closeManySessions(req: Request, res: Response) {
        try{
            const deleteAnswer = await this.deviceService.deleteOtherSessions(req.payload!)
            res.status(deleteAnswer.codResult).send({})
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }

    async closeOneSession(req: Request<{deviceId: string},{},{},{}>, res: Response) {
        try{
            const deleteAnswer = await this.deviceService.deleteSession(req.payload!.id, req.params.deviceId)
            res.status(deleteAnswer.codResult).send({})
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500);
        }
    }
}