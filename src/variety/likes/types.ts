import { Model } from "mongoose";
import { CommentModel, CommentType } from "../comments/domain/comment.entity";
import { PostModel, PostType } from "../posts/domain/post.entity";
import { Likeable } from "./domain/likes.recipient.entity";
import { LikeCommentModel, LikeModelType, LikePostModel, LikeType } from "./domain/likes.entity";
import { LastLikesType } from "./domain/last.likes.entity";

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

export type ExtendedLikesEntityViewType = {
    likesCount:     number,
    dislikesCount:  number,
    myStatus:       Rating,
    newestLikes:    Array<LastLikesViewType>
}

export type LastLikesViewType = {
    addedAt:  string,
    userId:   string,
    login:    string
  }


  export type PostsLastLikesViewType = {
    postId:       string,
    newestLikes:  Array<LastLikesViewType>
  }

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
