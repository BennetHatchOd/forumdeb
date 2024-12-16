import { deviceRepository } from "./repositories/deviceRepository";
import ShortUniqueId from 'short-unique-id';
import { CodStatus, StatusResult } from "../../types/interfaces";
import { activeSessionDB } from "../../db/dbTypes";
import {add} from 'date-fns'
import { TIME_LIFE_REFRESH_TOKEN } from "../../setting";

export const deviceService = {
 
    async createSession(userId: string, deviceName: string, ip: string): Promise <StatusResult<activeSessionDB|undefined>>{
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
            return {codResult: CodStatus.Ok, data: session}

        return insertSessions

    },

    async updateSession(session: activeSessionDB): Promise <StatusResult<activeSessionDB|undefined>>{
         
        const updateSessions = await deviceRepository.update(session)
        if (updateSessions.codResult == CodStatus.Ok)
            return {codResult: CodStatus.Ok, data: session}

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
}