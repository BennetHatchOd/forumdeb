import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_ACCESS_TOKEN, TIME_LIFE_REFRESH_TOKEN } from '../setting'
import { tokenPayload } from '../types/interfaces'
import { activeSessionDB } from '../db/dbTypes'
import { getTime } from 'date-fns'

export const jwtAdapter ={

    createAccessToken(session: activeSessionDB):string{
        const token = jwt.sign({userId: session.userId, 
                                iat: getTime(session.createdAt)}, 
                                SECRET_KEY, 
                                {expiresIn: TIME_LIFE_ACCESS_TOKEN})
        
        return token
    },

    createRefrashToken(session: activeSessionDB):string{
        const token = jwt.sign({userId: session.userId, 
                                version: session.version, 
                                deviceId: session.deviceId,
                                iat: getTime(session.createdAt),
                                exp: getTime(session.expiresAt)}, 
                                SECRET_KEY)
        return token
    },

    calcPayloadAT(token: string): string|null{
        try{
            const {userId} = jwt.verify(token, SECRET_KEY) as tokenPayload
            return userId
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