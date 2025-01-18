import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../../users/domain/user.entity";
import { UserRepository } from "../../users/repositories/user.repository";
import { CommentDocument, CommentModel } from "../../comments/domain/comment.entity";

export class LikeRepository{
    constructor(){}

    async hasCommentLike(commentId: string, userId: string):Promise<boolean>{
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        return user.myCommentRating!.hasLikes(new ObjectId(commentId))
    }

    async hasCommentDislike(commentId: string, userId: string):Promise<boolean>{
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        return user.myCommentRating!.hasDislikes(new ObjectId(commentId))
    }
 
    // Comment likes and dilikes

    async decCommentLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.decLikes()
    }
    
    async decCommentDislike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.decDislikes()
    }   
    
    async incCommentLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.incLikes()
    }   
    
    async incCommentDisLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.incDislikes()
    }

    // User likes and dislikes

    async deleteUserLike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.stopLikes(new ObjectId(commentId))
    }
    
    async deleteUserDislike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.stopDislikes(new ObjectId(commentId))
    }
    
    async addUserDislike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.addDislikes(new ObjectId(commentId))
    }

    async addUserLike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.addLikes(new ObjectId(commentId))
    }
}
