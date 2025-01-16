import { Rating } from "../likes/types"

export type CommentatorInfo ={
    userId:	    string,
    userLogin:  string	
}

export type LikesCommentViewType = {
    likesCount:      number,
    dislikesCount:   number,
    myStatus:   Rating
}

export type CommentViewType ={
    id:                 string,
    content:	        string
    commentatorInfo:	CommentatorInfo,
    createdAt:	        string,
    likesInfo:          LikesCommentViewType
}

export type CommentFullType ={
    id:                 string,
    content:	        string
    commentatorInfo:	CommentatorInfo,
    createdAt:	        Date,
    parentPostId:       string,
    likesInfo:          LikesCommentType
}

export type LikesCommentType = {
    likes: number;
    dislikes: number;
    myStatus:   Rating;
}

export type CommentInputType = {
    content:	string    //maxLength: 300, minLength: 20
}
