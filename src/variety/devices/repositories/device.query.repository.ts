import { ObjectId, WithId } from "mongodb";
import { activeSessionDB } from "../../../db/db.types";
import { CodStatus, StatusResult } from "../../../types/interfaces";
import { activeSessionType, DeviceViewType } from "../types";
import { sessionCollection } from "../../../db/db";

export const deviceQueryRepository = {
    async findManyByUserId(userId: string): Promise<Array<DeviceViewType>> {     
            
        if(!ObjectId.isValid(userId))    
            return [];

        const findSessions: Array<WithId<activeSessionDB>> = await (sessionCollection.find({userId: userId})).toArray() 
        const sessions = findSessions.map(s => this.mapDbView(s))

        return sessions
        // return sessions.length > 0  
        //         ? {codResult: CodStatus.Ok, data: sessions} 
        //         : null

    },

    mapDbView(user: WithId<activeSessionDB>): DeviceViewType{
        return {
            deviceId:   user.deviceId,
            title: user.deviceName,
            ip:         user.ip,
            lastActiveDate:  user.createdAt.toISOString(),
            }
    }
}
