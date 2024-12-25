import { deviceRepository } from "../repositories/deviceRepository";
import ShortUniqueId from 'short-unique-id';
import { CodStatus, StatusResult, tokenPayload } from "../../../types/interfaces";
import { activeSessionDB } from "../../../db/dbTypes";
import {add, getTime} from 'date-fns'
import { LENGTH_VERSION_ID, TIME_LIFE_REFRESH_TOKEN } from "../../../setting";
import { updateSessionType } from "../types";

export const deviceService = {
 
    async createSession(userId: string, deviceName: string, ip: string): Promise <StatusResult<tokenPayload|undefined>>{
        const uid = new ShortUniqueId({ length: LENGTH_VERSION_ID });
        const session: activeSessionDB = {
                                userId:     userId,
                                version:    uid.rnd(),
                                deviceId:   uid.rnd(),
                                deviceName: deviceName,
                                ip:         ip,
                                createdAt:  new Date(),
                                expiresAt:  add(new Date(), { seconds: TIME_LIFE_REFRESH_TOKEN})
                                } 
        const insertSessions = await deviceRepository.insert(session)
        if (insertSessions.codResult == CodStatus.Ok)
            return {codResult: CodStatus.Ok, data: deviceService.mapTokenFromSession(session)}

        return insertSessions
    },

    async updateSession(payload: tokenPayload): Promise <StatusResult<tokenPayload|undefined>>{
        const uid = new ShortUniqueId({ length: LENGTH_VERSION_ID });
        const session: updateSessionType = {
                                userId:     payload.userId,
                                version:    uid.rnd(),
                                deviceId:   payload.deviceId,
                                createdAt:  new Date(),
                                expiresAt:  add(new Date(), { seconds: TIME_LIFE_REFRESH_TOKEN})
                                }         
        
        const updateSessions = await deviceRepository.update(session)
        if (updateSessions.codResult == CodStatus.Ok)
            return {codResult: CodStatus.Ok, data: this.mapTokenFromSession(session)}

        return updateSessions

    },

    async isActive(session: tokenPayload): Promise<boolean> {     

        return await deviceRepository.isActive(session)  
    },

    // async checkRefreshToken(): Promise <StatusResult>{
    // },

    async deleteOtherSessions(payload: tokenPayload): Promise <StatusResult>{
        return await deviceRepository.deleteOthers(payload.userId, payload.deviceId)

    },
    async deleteSession(userId: string, deviceId: string): Promise <StatusResult>{
        const userDevice: string| null = await deviceRepository.findByDeviceID(deviceId)
        if(!userDevice)
            return {codResult: CodStatus.NotFound}
        if (userDevice != userId)
            return {codResult: CodStatus.Forbidden}

        return await deviceRepository.deleteOneOther(userId, deviceId)
    },
    // async updateSession(): Promise <StatusResult>{
    // },
        
    async clear(): Promise<StatusResult> {
        return await deviceRepository.clear()
    },

    mapTokenFromSession(session: updateSessionType): tokenPayload{
        return {
            userId:     session.userId,
            version:    session.version,
            iat:        Math.floor(getTime(session.createdAt) / 1000),
            exp:        Math.floor(getTime(session.expiresAt) / 1000),
            deviceId:   session.deviceId
          }
    }
}