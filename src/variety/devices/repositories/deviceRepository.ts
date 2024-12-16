import { ObjectId, WithId } from "mongodb";
import { CodStatus, StatusResult, tokenPayload } from "../../../types/interfaces";
import { requestCollection, sessionCollection } from "../../../db/db";
import { activeSessionDB } from "../../../db/dbTypes";
import { activeSessionModel } from "../types";
import { getTime } from "date-fns";

export const deviceRepository = {
 
    async findManyByUserId(userId: string): Promise<StatusResult<Array<activeSessionModel>|undefined>> {     
            
        if(!ObjectId.isValid(userId))    
            return {codResult : CodStatus.NotFound};

        const findSessions: Array<WithId<activeSessionDB>> = await (sessionCollection.find({_id: new ObjectId(userId)})).toArray() 
        const sessions = findSessions.map(s => this.mapDBview(s))

        return sessions.length > 0  
                ? {codResult: CodStatus.Ok, data: sessions} 
                : {codResult: CodStatus.NotFound};

    },

    async insert(session: activeSessionDB): Promise<StatusResult> {     

        const insertAnswer = await sessionCollection.insertOne({...session}) 
        
        return insertAnswer.acknowledged  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.Error};

    },    
   
    async isActive(session: tokenPayload): Promise<boolean> {     

        await sessionCollection.deleteMany({userId:   session.userId, 
                                           exp: { $lt: getTime(new Date) }}) 

        const findAnswer = await sessionCollection.findOne({userId: session.userId, 
                                                            version: session.version, 
                                                            deviceId: session.deviceId}) 
        
        return findAnswer  
              ? true 
              : false

    },

    async deleteThis(session: tokenPayload): Promise<StatusResult> {     

        const deleteAnswer = await sessionCollection.deleteOne({userId: session.userId, 
                                                                version: session.version, 
                                                                deviceId: session.deviceId}) 
        
        return deleteAnswer.deletedCount == 1  
                ? {codResult: CodStatus.NoContent} 
                : {codResult: CodStatus.Error};

    },

    async deleteOneOther(session: tokenPayload): Promise<StatusResult> {     

        const deleteAnswer = await sessionCollection.deleteOne({userId: session.userId, 
                                                              deviceId: session.deviceId}) 
        
        return deleteAnswer.deletedCount == 1  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};

    },

    async deleteOthers(session: tokenPayload): Promise<StatusResult> {     

        const deleteAnswer = await sessionCollection.deleteMany({userId:   session.userId, 
                                                                version:  { $ne: session.version }, 
                                                                deviceId: { $ne: session.deviceId }}) 
        
        return deleteAnswer.acknowledged  
                ? {codResult: CodStatus.Ok} 
                : {codResult: CodStatus.NotFound};
    },

    // async clearExpired(userId: string): Promise<void> {
    //     await sessionCollection.deleteMany({userId:   userId, 
    //                                        exp: { $lt: getTime(new Date) }}) 

    // },

    async update(session: activeSessionDB): Promise <StatusResult>{
         
        const updateSessions = await sessionCollection.updateOne({  userId: session.userId, 
                                                                    deviceId: session.deviceId},
                                                                 {$set: { 
                                                                    version: session.version, 
                                                                    createdAt: session.createdAt, 
                                                                    expiresAt: session.expiresAt }} 
                                                                )
        if (updateSessions.modifiedCount == 1)
            return {codResult: CodStatus.Ok}

        return {codResult: CodStatus.Error}

    },

    mapDBview(user: WithId<activeSessionDB>): activeSessionModel{
        return {
            id:         user._id.toString(),
            userId:     user.userId,
            version:    user.version,
            deviceId:   user.deviceId,
            deviceName: user.deviceName,
            ip:         user.ip,
            createdAt:  user.createdAt,
            expiresAt:  user.expiresAt
            }
    },


    async clear(): Promise <StatusResult> {
        await requestCollection.deleteMany()
        await sessionCollection.deleteMany()
        return (await requestCollection.countDocuments({}) == 0 && await sessionCollection.countDocuments({}) == 0) 
            ? {codResult: CodStatus.NoContent }  
            : {codResult: CodStatus.Error, message: 'Collections isn\'t empty'};
    }
}