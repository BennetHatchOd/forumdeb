import jwt from 'jsonwebtoken'
import { SECRET_KEY, TIME_LIFE_TOKEN } from '../setting'

export const jwtService ={

    createToken(userId: string, secretKey: string):string{
        const token = jwt.sign({userId: userId}, secretKey, {expiresIn: TIME_LIFE_TOKEN})
        return token
    },

    findIdbyToken(token: string, secretKey: string): string|null{
        try{
            const answer: any = jwt.verify(token, secretKey)
            return answer.userId
        }
        catch(err){
            return null
        }
    }

}