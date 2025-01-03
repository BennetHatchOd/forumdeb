import { updateSessionType } from "../types";
import { getTime } from "date-fns";
import { DeviceDocument, DeviceModel, DeviceType } from "../domain/device.entity";
import { CodStatus, StatusResult, tokenPayload } from "../../../types/types";
import { RequestModel } from "../../auth/domain/request.entity";

export class DeviceRepository {
 
    async findByDeviceID(deviceId: string): Promise<string|null> {     
            
        const findSession: DeviceDocument|null = await DeviceModel.findOne({deviceId: deviceId})
        if(!findSession)
            return null
        
        return findSession.userId
    }

    async create(session: DeviceType): Promise<StatusResult> {     

        const device = await DeviceModel.create(session)

        return {codResult: CodStatus.Created}     
        

    }    
   
    async isActive(session: tokenPayload): Promise<boolean> {     
//  additionally clears the database of expired sessions

        await this.clearExpired(session.userId)

        const findAnswer = await DeviceModel.findOne({userId: session.userId, 
                                                    version: session.version, 
                                                    deviceId: session.deviceId}) 
        
        return findAnswer  
              ? true 
              : false

    }

    async deleteThis(session: tokenPayload): Promise<StatusResult> {     

        const deleteAnswer = await DeviceModel.deleteOne({userId: session.userId, 
                                                                version: session.version, 
                                                                deviceId: session.deviceId}) 
        
        return deleteAnswer.deletedCount == 1  
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound};

    }

    async deleteOneOther(userId: string, deviceId: string): Promise<StatusResult> {     

        const deleteAnswer = await DeviceModel.deleteOne({userId: userId, 
                                                        deviceId: deviceId}) 
        
        return deleteAnswer.deletedCount == 1  
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.NotFound};

    }

    async deleteOthers(userId: string, deviceId: string): Promise<StatusResult> {     

        const deleteAnswer = await DeviceModel.deleteMany({userId:   userId, 
                                                          deviceId: { $ne: deviceId }}) 
        
        if(!deleteAnswer.acknowledged)
            throw "error of deleting sessions"
        
        return{codResult: CodStatus.NoContent} 
        
    }

    async clearExpired(userId: string): Promise<void> {
        await DeviceModel.deleteMany({userId:   userId, 
        exp: { $lt: getTime(new Date) }}) 

     }

    async update(session: updateSessionType): Promise <StatusResult>{
         
        const oldSession:DeviceDocument|null = await DeviceModel.findOne({userId: session.userId, 
                                                                        deviceId: session.deviceId})
        
        if(!oldSession) throw "error reading session for update"

        oldSession.version = session.version 
        oldSession.createdAt = session.createdAt 
        oldSession.expiresAt = session.expiresAt 

        oldSession.save()
        return {codResult: CodStatus.Ok}
   }

    // mapDbView(user: WithId<activeSessionDB>): activeSessionType{
    //     return {
    //        // id:         user._id.toString(),
    //         userId:     user.userId,
    //         version:    user.version,
    //         deviceId:   user.deviceId,
    //         deviceName: user.deviceName,
    //         ip:         user.ip,
    //         createdAt:  user.createdAt,
    //         expiresAt:  user.expiresAt
    //         }
    // },


    async clear(): Promise <StatusResult> {
        await RequestModel.deleteMany()
        await DeviceModel.deleteMany()
        if (await RequestModel.countDocuments({}) == 0 && await DeviceModel.countDocuments({}) == 0) 
            return {codResult: CodStatus.NoContent }  
        throw "Collections isn\'t empty"
    }
}