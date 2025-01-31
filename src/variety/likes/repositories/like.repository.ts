import { ObjectId } from "mongodb";
import { HydratedDocument, Model } from "mongoose";
import { Likeable } from "../domain/likes.recipient.entity";
import {Rating } from "../types";
import { LikeType } from "../domain/likes.entity";

export class LikeRepository{
    constructor(){}

    async hasLikeDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string):Promise<Array<{active: boolean, rating: Rating}>>{
    
        return await model.find({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), active: true}).select({_id: 0, rating: 1}).exec()
    
    }

    async hasArrayLikeDislikes<T extends LikeType>( model: Model<T>, entitiesId: Array<string>, userId: string){
        const answer = await model.find({ targetId: {$in: entitiesId.map(s => new ObjectId(s))}, ownerId: new ObjectId(userId), active: true}).select({_id: 0, targetId: 1, rating: 1}).lean().exec()
        if(answer.length == 0)
            return []
        return answer.map(s => {return {targetId: s.targetId!.toString(), rating: s.rating}})
    }

     // User likes and dislikes
 
    async stopLike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
        const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
        if(count > 1)
            throw new Error("Wrong likes in documents")
        if(count == 0)
            throw new Error("Like not found")
        const document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
        document!.active = false
        await document!.save()
    }

    async stopDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
        const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
        if(count > 1)
            throw new Error("Wrong dislikes in documents")
        if(count == 0)
            throw new Error("Dislike not found")

        const document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})

        document!.active = false
        await document!.save()
    }

    async addDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
        const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
        if(count > 1)
            throw new Error("Wrong dislikes in documents")
        if(count == 0){
            await model.create({
                active:     true,
                createdAt:  new Date(),
                targetId:   entityId,
                ownerId:    userId,
                rating:     Rating.Dislike})
            return
        }

        let document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
            document!.active = true
            await document!.save()
    }
    
    async addLike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
        const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
        if(count > 1)
            throw new Error("Wrong likes in documents")
        if(count == 0){
            await model.create({
                active:     true,
                createdAt:  new Date(),
                targetId:   entityId,
                ownerId:    userId,
                rating:     Rating.Like})
            return
        }

        let document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
            document!.active = true
            await document!.save()
    }
    
    // Entity likes and dilikes

    async decrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        document.likesInfo.likesCount--  
        await document.save()
    }
    
    async decrementDislike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        document.likesInfo.dislikesCount--
        await document.save()
    }   
    
    async incrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        document.likesInfo.likesCount++
        await document.save()
    }   
    
    async incrementDisLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        
        //await model.updateOne({ _id: new ObjectId(id)}, {$inc : {"likesInfo.likes": 1}})

        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        document.likesInfo.dislikesCount++
        await document.save()
    }


}
