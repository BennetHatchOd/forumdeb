import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_ACCESS_TOKEN } from '../setting/setting'
import { tokenPayload } from '../types/types'

export class JwtAdapter{

    createAccessToken(payload: tokenPayload):string{
        const token = jwt.sign({...payload, exp: payload.iat + TIME_LIFE_ACCESS_TOKEN}, SECRET_KEY) 

        return token
    }

    createRefrashToken(payload: tokenPayload):string{
        const token = jwt.sign(payload, SECRET_KEY)
        return token
    }

    calcPayloadAT(token: string): string|null{
        try{
            const data = jwt.verify(token, SECRET_KEY) as tokenPayload
            return data.userId
        }
        catch(err){
            return null
        }
    }


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