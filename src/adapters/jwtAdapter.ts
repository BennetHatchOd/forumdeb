import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_ACCESS_TOKEN, TIME_LIFE_REFRESH_TOKEN } from '../setting'
import { tokenPayload } from '../types/interfaces'

export const jwtAdapter ={

    createAccessToken(userId: string):string{
        const token = jwt.sign({userId: userId}, SECRET_KEY, {expiresIn: TIME_LIFE_ACCESS_TOKEN})
        return token
    },

    createRefrashToken(userId: string, tokenVersion: string):string{
        const token = jwt.sign({userId: userId, version: tokenVersion}, SECRET_KEY, {expiresIn: TIME_LIFE_REFRESH_TOKEN})
        return token
    },

    calcPayload(token: string): {userId:string, version?:string, exp?: number}|null{
        try{
            const {userId, version, exp} = jwt.verify(token, SECRET_KEY) as tokenPayload
            return {userId, version, exp}
        }
        catch(err){
            return null
        }
    }

}