import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/db";
import { UserDBModel } from "../../db/dbTypes";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { AboutUser } from "./types";

export const authRepository = {
  
    async getUserByLoginEmail(loginOrEmail: string): Promise<StatusResult<{id:string, passHash:string}|undefined>> {      

        const checkedUser: WithId<UserDBModel>|null = await userCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
        
        return checkedUser === null 
            ? {codResult: CodStatus.NotFound} 
            : {codResult: CodStatus.Ok, data: {id:       checkedUser._id.toString(), 
                                               passHash: checkedUser.password}};
    },

    async findById(id: string): Promise < StatusResult<AboutUser|undefined> > {     
             
        const searchItem: WithId<UserDBModel> | null = await userCollection.findOne({_id: new ObjectId(id)})  
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: { 
                email:      searchItem.email,      
                login:      searchItem.login,
                userId:     searchItem._id.toString()}
            }
    },
}
