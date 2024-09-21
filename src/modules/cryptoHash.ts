import bcrypt from 'bcrypt'


export const cryptoHash = {
    
    async createHash(password: string){
        try{
            const saltRounds = 10
            const salt: string = await bcrypt.genSalt(saltRounds)
            const hash: string = await bcrypt.hash(password, salt)

            return hash;
        }
        catch(err){
            throw err;           
        }
    },


    async checkHash(password: string, hash: string){
        try{    
            return await bcrypt.compare(password, hash)
        }
        catch(err){
            throw err;           
        }
    }
}