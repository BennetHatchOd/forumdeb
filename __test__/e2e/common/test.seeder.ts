import { authUserCollection } from "../../../src/db/db"
import { UserInputModel } from "../../../src/variety/users/types"

export const testSeeder = {
    createGoodUser(prefix: string = ''){
        return {
            login: prefix + 'lhfg',
            email: prefix + 'gh2@test.com',
            password: 'paSSword'
        }
    },

    createManyGoodUsers(n: number){
        
        const users: Array<UserInputModel> = [];
        
        for(let i = 0; i < n; i++)
            users.push({login: `lhfg${i}`,
                        email: `gh2${i}@test.com`,
                        password: `paSSword${i}`
        })
        return users;
    },

    createBadUser(){
        return {
            login: 'lhfg',
            email: 'gh2@test.com',
            password: 'paSS'
        }
    },

    createTitleDevices(){
        return ['Chrome 12', 'Chrome 34', 'Android 17', 'Android 5', 'IoS 6']
    }
}