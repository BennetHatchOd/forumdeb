import bcrypt from 'bcrypt'


export class PasswordHashAdapter {
    
    async createHash(password: string):Promise<string>{
        const saltRounds = 10
        const salt: string = await bcrypt.genSalt(saltRounds)
        const hash: string = await bcrypt.hash(password, salt)

        return hash;
        
    }

    async checkHash(password: string, hash: string):Promise<boolean>{

        return await bcrypt.compare(password, hash)
        
    }
}