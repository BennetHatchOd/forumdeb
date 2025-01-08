import { DeleteResult, ObjectId, WithId } from "mongodb";
import { CodStatus, StatusResult } from "../../../types/types";
import { AboutUser } from "../../auth/types";
import { UserDocument, UserModel, UserType } from "../domain/user.entity";

export class UserRepository {

    constructor(){
        // private user = new UserModel()
    }
  
    async isExist(id: string): Promise<StatusResult>{     
        
        if(!ObjectId.isValid(id))    
            return {codResult : CodStatus.NotFound};

        const exist: number = await UserModel.countDocuments({_id: new ObjectId(id)})           
        
        return exist > 0  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    }
 
    async findIdByEmail(email: string): Promise<StatusResult<string|undefined>>{     

        const user: UserDocument|null = await UserModel.findOne({email: email})           
        
        if(user)
            return {codResult: CodStatus.Ok, data: user._id.toString()} 
        
        return {codResult: CodStatus.NotFound};
    }

    async checkUniq(loginCheck: string, emailCheck: string): Promise<StatusResult<string[]|undefined>> {
        
        const existEmail = await UserModel.countDocuments({ email: emailCheck })
        const existLogin = await UserModel.countDocuments({ login: loginCheck })

        let arrayErrors: Array<string> = [] 
        if(existEmail > 0) 
            arrayErrors.push('email') 
        if(existLogin > 0) 
            arrayErrors.push('login')

        return arrayErrors.length == 0
            ?  {codResult: CodStatus.Ok}
            :  {codResult: CodStatus.BadRequest, data: arrayErrors};
    }
   
    async getPartUserByLoginEmail(loginOrEmail: string): Promise<StatusResult<{id:string, passHash:string}|undefined>> {      

        const checkedUser: UserDocument|null = await UserModel.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})           
        
        return checkedUser === null 
            ? {codResult: CodStatus.NotFound} 
            : {codResult: CodStatus.Ok, data: {id:       checkedUser._id.toString(), 
                                               passHash: checkedUser.password}};
    }

    async findForOwnerById(id: string): Promise < StatusResult<AboutUser|undefined> > {     
             
        const searchItem: UserDocument | null = await UserModel.findOne({_id: new ObjectId(id)})  
        if(!searchItem)
            return {codResult: CodStatus.NotFound}

        return {
            codResult: CodStatus.Ok, 
            data: { 
                email:      searchItem.email,      
                login:      searchItem.login,
                userId:     searchItem._id.toString()}
            }
    }

    async create(createdUser: UserType): Promise <StatusResult<string|undefined>>{  
        //const user = new UserModel(createdUser)

        const savedUser =await UserModel.create(createdUser)
        return {codResult: CodStatus.Created, data: savedUser._id.toString()}
    }
    
    async editPassword(userId: string, hash: string): Promise <StatusResult>{  
        
        const user = await UserModel.findOne({_id: new ObjectId(userId)})

        if(!user)
            throw 'user not found'

        user.password = hash
        await user.save()
        return {codResult: CodStatus.Ok}
    }

    async delete(id: string):  Promise <StatusResult>{      
        const answerDelete: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})

        return answerDelete.deletedCount == 1 
            ? {codResult: CodStatus.NoContent}  
            : {codResult: CodStatus.NotFound};
    }

    async clear(): Promise <StatusResult> {
        await UserModel.deleteMany()
        if(await UserModel.countDocuments({}) != 0) throw "Collection isn\'t empty";
        
        return {codResult: CodStatus.NoContent }  
         
    }
}
