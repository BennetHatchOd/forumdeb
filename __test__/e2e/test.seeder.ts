import { authUserCollection } from "../../src/db/db"
import { UserInputModel } from "../../src/variety/users/types"

export const testSeeder = {
    createGoodUser(){
        return {
            login: 'lhfg',
            email: 'gh2@test.com',
            password: 'paSSword'
        }
    },

    createBadUser(){
        return {
            login: 'lhfg',
            email: 'gh2@test.com',
            password: 'paSS'
        }
    },

    insertUncorfirmedUser(newUser: UserInputModel){
        // const newUser: UserUnconfirmedDBModel
        // authUserCollection.insertOne()      
    }
}