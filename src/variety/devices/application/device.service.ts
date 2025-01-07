import ShortUniqueId from 'short-unique-id';
import {add, getTime} from 'date-fns'
import { LENGTH_VERSION_ID, TIME_LIFE_REFRESH_TOKEN } from "../../../setting/setting";
import { updateSessionType } from "../types";
import { CodStatus, StatusResult, tokenPayload } from "../../../types/types";
import { DeviceRepository } from '../repositories/device.repository';
import { DeviceType } from '../domain/device.entity';

export class DeviceService {
 
    constructor(private deviceRepository: DeviceRepository){}

    async createSession(userId: string, deviceName: string, ip: string): Promise <StatusResult<tokenPayload|undefined>>{
        const uid = new ShortUniqueId({ length: LENGTH_VERSION_ID });
        const session: DeviceType = {
                                userId:     userId,
                                version:    uid.rnd(),
                                deviceId:   uid.rnd(),
                                deviceName: deviceName,
                                ip:         ip,
                                createdAt:  new Date(),
                                expiresAt:  add(new Date(), { seconds: TIME_LIFE_REFRESH_TOKEN})
                                } 
        const insertSessions = await this.deviceRepository.create(session)
        if (insertSessions.codResult == CodStatus.Created)
            return {codResult: CodStatus.Ok, data: this.mapTokenFromSession(session)}

        return insertSessions
    }

    async updateSession(payload: tokenPayload): Promise <StatusResult<tokenPayload|undefined>>{

        const uid = new ShortUniqueId({ length: LENGTH_VERSION_ID });
        const session: updateSessionType = {
                                userId:     payload.userId,
                                version:    uid.rnd(),
                                deviceId:   payload.deviceId,
                                createdAt:  new Date(),
                                expiresAt:  add(new Date(), { seconds: TIME_LIFE_REFRESH_TOKEN})
                                }         

        const updateSessions = await this.deviceRepository.update(session)
        if (updateSessions.codResult == CodStatus.Ok)
            return {codResult: CodStatus.Ok, data: this.mapTokenFromSession(session)}

        return updateSessions

    }

    async isActive(session: tokenPayload): Promise<boolean> {     

        return await this.deviceRepository.isActive(session)  
    }

    async deleteOtherSessions(payload: tokenPayload): Promise <StatusResult>{
        return await this.deviceRepository.deleteOthers(payload.userId, payload.deviceId)

    }

    async deleteSession(userId: string, deviceId: string): Promise <StatusResult>{

        const userDevice: string| null = await this.deviceRepository.findByDeviceID(deviceId)
        if(!userDevice)
            return {codResult: CodStatus.NotFound}
        if (userDevice != userId)
            return {codResult: CodStatus.Forbidden}

        const answer = await this.deviceRepository.deleteOneOther(userId, deviceId)
        if (answer.codResult == CodStatus.NoContent)
            return answer

        throw "error of deleting sessions"
    }
 
    async clear(): Promise<StatusResult> {
        return await this.deviceRepository.clear()
    }

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