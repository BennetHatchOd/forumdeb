import { UserInnerModel } from "../../../types";
import { userCollection } from "../../../db/db";
import { UserDBType } from "../../../db/dbTypes";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";

export const userRepository = {
  
    async checkExist(loginOrEmail: string): Promise < null | string > {          
        try{
            const checkedUser: UserDBType | null = await userCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
            
            return checkedUser === null ? null : checkedUser.password;
        } 
        catch (err){      
            console.log(err)
            throw(err);
        }
    },

    async isExist(id: string): Promise < boolean > {          
        try{
            if(!ObjectId.isValid(id))
                return false;        
            const exist: number = await userCollection.countDocuments({_id: new ObjectId(id)})           
             return exist > 0 ? true : false;
        } 
        catch (err){      
            console.log(err)
            throw(err);
        }
    },
 
    async checkUniq(loginCheck: string, emailCheck: string): Promise < Array<string >> {
        try{
            const existEmail: number = await userCollection.countDocuments({ email: emailCheck })
            const existLogin: number = await userCollection.countDocuments({ login: loginCheck })

            let answer: Array<string> = [] 
            if(existEmail > 0) 
                answer.push('email') 
            if(existLogin > 0) 
                answer.push('login') 
            return answer;
            }
        catch (err){      
            console.log(err)
            throw(err);
        }
    },
   
    async create(createItem: UserInnerModel): Promise < string | null>{  
        try{
            const answerInsert: InsertOneResult = await userCollection.insertOne(this.mapViewToDb(createItem));
            return answerInsert.insertedId ? answerInsert.insertedId.toString() : null;
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },

    
    async delete(id: string): Promise < boolean > {      
        try{
            const answerDelete: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)})

            return answerDelete.deletedCount != 0 ? true : false;
        } 
        catch (err){
            console.log(err)
            throw(err);
        }
    },

    async clear(): Promise < boolean > {
        try{
            await userCollection.deleteMany()
            return await userCollection.countDocuments({}) == 0 ? true : false;
        } catch(err){
            console.log(err)
            throw(err);
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
