import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_ACCESS_TOKEN } from '../setting'
import { tokenPayload } from '../types/interfaces'
import { activeSessionDB } from '../db/dbTypes'
import { fromUnixTime, getTime } from 'date-fns'

export const jwtAdapter ={

    createAccessToken(session: activeSessionDB):string{
        const token = jwt.sign({userId: session.userId, 
                                iat: Math.floor(getTime(session.createdAt) / 1000), 
                                exp: Math.floor(getTime(session.createdAt) / 1000 + TIME_LIFE_ACCESS_TOKEN)}, 
                                SECRET_KEY) 

        return token
    },

    createRefrashToken(session: activeSessionDB):string{
        const token = jwt.sign({userId: session.userId, 
                                version: session.version, 
                                deviceId: session.deviceId,
                                iat: Math.floor(getTime(session.createdAt) / 1000),
                                exp: Math.floor(getTime(session.expiresAt) / 1000)}, 
                                SECRET_KEY)
        return token
    },

    calcPayloadAT(token: string): string|null{
        try{
            const data = jwt.verify(token, SECRET_KEY) as tokenPayload
            console.log('calcPayloadAT ->', data, 'exp ->', fromUnixTime(data.exp / 1000), 'Date ->', (new Date).toISOString())
            return data.userId
        }
        catch(err){
            return null
        }
    },


    calcPayloadRT(token: string): tokenPayload|null{
        try{
            const payload: tokenPayload = jwt.verify(token, SECRET_KEY) as tokenPayload
            return payload
        }
        catch(err){
            return null
        }
    }

}