import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_ACCESS_TOKEN } from '../setting'
import { tokenPayload } from '../types/interfaces'
import { getTime } from 'date-fns'
import { deviceService } from '../variety/devices/deviceService'

export const jwtAdapter ={

    createAccessToken(payload: tokenPayload):string{
        const token = jwt.sign({...payload, exp: payload.iat + TIME_LIFE_ACCESS_TOKEN}, SECRET_KEY) 

        return token
    },

    createRefrashToken(payload: tokenPayload):string{
        const token = jwt.sign(payload, SECRET_KEY)
        return token
    },

    calcPayloadAT(token: string): string|null{
        try{
            const data = jwt.verify(token, SECRET_KEY) as tokenPayload
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