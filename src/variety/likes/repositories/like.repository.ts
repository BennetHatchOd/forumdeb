import { ObjectId } from "mongodb";
import { UserDocument, UserModel, UserType } from "../../users/domain/user.entity";
import { HydratedDocument, Model } from "mongoose";
import { Likeable } from "../domain/likes.recipient.entity";

export class LikeRepository{
    constructor(){}

    async hasCommentLike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">):Promise<boolean>{
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        return user[likeRecipient]!.hasLikes(new ObjectId(commentId))
    }

    async hasCommentDislike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">):Promise<boolean>{
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        return user[likeRecipient]!.hasDislikes(new ObjectId(commentId))
    }
 
    // Comment likes and dilikes

    async decrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        await document.likesInfo.decrementLikes()  
        await document.save()
    }
    
    async decrementDislike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        await document.likesInfo.decrementDislikes()
        await document.save()
    }   
    
    async incrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        await document.likesInfo.incrementLikes()
        await document.save()
    }   
    
    async incrementDisLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
        const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
  
        if (!document) {
          throw new Error("Document not found");
        }
        await document.likesInfo.incrementDislikes()
        await document.save()
    }

    // User likes and dislikes

    async deleteUserLike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user[likeRecipient]!.stopLikes(new ObjectId(commentId))
        await user.save()
    }
    
    async deleteUserDislike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user[likeRecipient]!.stopDislikes(new ObjectId(commentId))
        await user.save()
    }
    
    async addUserDislike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user[likeRecipient]!.addDislikes(new ObjectId(commentId))
        await user.save()
    }

    async addUserLike(commentId: string, userId: string, likeRecipient: keyof Pick<UserType, "myCommentRating" | "myPostRating">){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user[likeRecipient]!.addLikes(new ObjectId(commentId))
        await user.save()
    }
}
