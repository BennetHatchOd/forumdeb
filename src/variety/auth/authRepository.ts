import { userCollection } from "../../db/db";
import { UserDBType } from "../../db/dbTypes";
import { CodStatus, StatusResult } from "../../interfaces";

export const authRepository = {
  
    async getPasswordByLoginEmail(loginOrEmail: string): Promise<StatusResult<string|undefined>> {          
        const checkedUser: UserDBType|null = await userCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
        
        return checkedUser === null 
            ? {codResult: CodStatus.NotFound} 
            : {codResult: CodStatus.Ok, data: checkedUser.password};
    },

}
