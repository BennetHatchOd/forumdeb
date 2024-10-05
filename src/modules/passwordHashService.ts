import bcrypt from 'bcrypt'


export const passwordHashService = {
    
    async createHash(password: string){
        const saltRounds = 10
        const salt: string = await bcrypt.genSalt(saltRounds)
        const hash: string = await bcrypt.hash(password, salt)

        return hash;
        
    },


    async checkHash(password: string, hash: string){

        return await bcrypt.compare(password, hash)
        
    }
}