import { LikesRecipientType } from "../likes/domain/likes.recipient.entity"
import { LikesEntityViewType } from "../likes/types"
import { CommentatorInfoType } from "./domain/comment.entity"

export type CommentViewType ={
    id:                 string,
    content:	        string
    commentatorInfo:	CommentatorInfoType,
    createdAt:	        string,
    likesInfo:          LikesEntityViewType
}

export type CommentInputType = {
    content:	string    //maxLength: 300, minLength: 20
}
