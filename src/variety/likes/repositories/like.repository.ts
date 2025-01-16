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
 
    async decCommentLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.decLikes()
        await comment.save()

    }
    
    async decCommentDislike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.decDislikes()
        await comment.save()

    }   
    
    async incCommentLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.incLikes()
        await comment.save()

    }   
    
    async incCommentDisLike(commentId: string){
        const comment: CommentDocument|null = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if(!comment)
            throw "Comment not found"
        await comment.likesInfo.incDislikes()
        await comment.save()

    }

    async deleteUserLike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.stopLikes(new ObjectId(commentId))
        await user.save()

    }
    
    async deleteUserDislike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.stopDislikes(new ObjectId(commentId))
        await user.save()

    }
    
    async addUserDislike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.addDislikes(new ObjectId(commentId))
        await user.save()

    }

    async addUserLike(commentId: string, userId: string){
        const user: UserDocument|null = await UserModel.findOne({_id: new ObjectId(userId)})
        if(!user)
            throw "User not found"
        await user.myCommentRating!.addLikes(new ObjectId(commentId))
        await user.save()

    }
}
