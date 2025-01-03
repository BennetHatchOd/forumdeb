import { ObjectId, WithId } from "mongodb";
import { DeviceViewType } from "../types";
import { DeviceDocument, DeviceModel } from "../domain/device.entity";

export class DeviceQueryRepository {
    async findManyByUserId(userId: string): Promise<Array<DeviceViewType>> {     
            
        if(!ObjectId.isValid(userId))    
            return [];

        const findSessions: Array<DeviceDocument> = await (DeviceModel.find({userId: userId})) 
        const sessions = findSessions.map(s => this.mapDbView(s))

        return sessions
    }

    mapDbView(user: DeviceDocument): DeviceViewType{
        return {
            deviceId:       user.deviceId,
            title:          user.deviceName,
            ip:             user.ip,
            lastActiveDate: user.createdAt.toISOString(),
            }
    }
}
