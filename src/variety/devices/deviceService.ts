import { deviceRepository } from "./repositories/deviceRepository";
import ShortUniqueId from 'short-unique-id';
import { CodStatus, StatusResult, tokenPayload } from "../../types/interfaces";
import { activeSessionDB } from "../../db/dbTypes";
import {add, getTime} from 'date-fns'
import { TIME_LIFE_REFRESH_TOKEN } from "../../setting";
import { updateSessionModel } from "./types";

export const deviceService = {
 
    async createSession(userId: string, deviceName: string, ip: string): Promise <StatusResult<tokenPayload|undefined>>{
        const uid = new ShortUniqueId({ length: 5 });
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
        const uid = new ShortUniqueId({ length: 5 });
        const session: updateSessionModel = {
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

    // async checkRefreshToken(): Promise <StatusResult>{
    // },

    // async deleteManySessions(): Promise <StatusResult>{
    // },
    // async deleteSession(): Promise <StatusResult>{
    // },
    // async updateSession(): Promise <StatusResult>{
    // },
        
    async clear(): Promise<StatusResult> {
        return await deviceRepository.clear()
    },

    mapTokenFromSession(session: updateSessionModel): tokenPayload{
        return {
            userId:     session.userId,
            version:    session.version,
            iat:        Math.floor(getTime(session.createdAt) / 1000),
            exp:        Math.floor(getTime(session.expiresAt) / 1000),
            deviceId:   session.deviceId
          }
    }
}