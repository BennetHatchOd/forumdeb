import { UserInnerModel } from "../../../types";
import { userCollection } from "../../../db/db";
import { UserDBType } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { CodStatus, StatusResult } from "../../../interfaces";
import { catchErr } from "../../../modules/catchErr";

export const userRepository = {
  
    async getPasswordByLoginEmail(loginOrEmail: string): Promise<StatusResult<string|null>> {          
        try{
            const checkedUser: UserDBType|null = await userCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
            
            return checkedUser === null 
                ? {codResult: CodStatus.NotFound} 
                : {codResult: CodStatus.Ok, data: checkedUser.password};
        } 
        catch (err){      
            return catchErr(err);
        }
    },

    async isExist(id: string): Promise<StatusResult>{     
        
        try{
            if(!ObjectId.isValid(id))    
                return {codResult : CodStatus.NotFound};

            const exist: number = await userCollection.countDocuments({_id: new ObjectId(id)})           
            
            return exist > 0  
                  ? {codResult: CodStatus.Ok} 
                  : {codResult: CodStatus.NotFound};
        } 
        catch (err){
            return catchErr(err);
        }
    },
 
    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|null>> {
        try{
            const existEmail = await userCollection.countDocuments({ email: emailCheck })
            const existLogin = await userCollection.countDocuments({ login: loginCheck })

            let arrayErrors: Array<string> = [] 
            if(existEmail > 0) 
                arrayErrors.push('email') 
            if(existLogin > 0) 
                arrayErrors.push('login')

            return arrayErrors.length == 0
                ?  {codResult: CodStatus.Ok}
                :  {codResult: CodStatus.BadRequest, data: arrayErrors};
            }
        catch (err){  
            throw err;
        }
    },
   
    async create(createItem: UserInnerModel): Promise <StatusResult<string|null>>{  
        try{
            const answerInsert: InsertOneResult = await userCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.acknowledged  
              ? {codResult: CodStatus.Created, data: answerInsert.insertedId.toString()}  
              : {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },

    
    async delete(id: string):  Promise <StatusResult>{      
        try{
            const answerDelete: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount == 1 ?
                    {codResult: CodStatus.NoContent} : 
                    {codResult: CodStatus.Error, message: 'the server didn\'t confirm the operation'};
        } 
        catch (err){
            return catchErr(err);
        }
    },

    async clear(): Promise <StatusResult> {
        try{
            await userCollection.deleteMany()
            return await userCollection.countDocuments({}) == 0 ?
                {codResult: CodStatus.NoContent } : 
                {codResult: CodStatus.Error};
        } 
        catch(err){
            return catchErr(err);
        }
    },

    mapViewToDb(item: UserInnerModel): UserDBType {
        
        const _id: ObjectId = ObjectId.isValid(item.id) ? new ObjectId(item.id) : new ObjectId;    
        return { 
            _id: _id,
            password: item.password,
            login: item.login,
            email: item.email,
            createdAt: item.createdAt,
        }
                   
        }


}
