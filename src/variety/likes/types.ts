import { Model } from "mongoose";
import { CommentModel, CommentType } from "../comments/domain/comment.entity";
import { PostModel, PostType } from "../posts/domain/post.entity";
import { Likeable } from "./domain/likes.recipient.entity";
import { LikeCommentModel, LikeModelType, LikePostModel, LikeType } from "./domain/likes.entity";

export enum Rating {
    None = "None", 
    Like = "Like",
    Dislike = "Dislike",
  }

export type LikesEntityViewType = {
    likesCount:     number,
    dislikesCount:  number,
    myStatus:       Rating
}

// export type LikesType = {
//     likes: number;
//     dislikes: number;
// }


export type LikeRecipient<T extends Likeable> = {
  collectionModel: LikeModelType
  model: Model<T>
}

export const LikeComment: LikeRecipient<CommentType> = {
  collectionModel: LikeCommentModel,
  model: CommentModel
}
export const LikePost: LikeRecipient<PostType> = {
  collectionModel: LikePostModel,
  model: PostModel
}
