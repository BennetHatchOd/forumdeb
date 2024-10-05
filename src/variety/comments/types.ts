export type CommentatorInfo ={
    userId:	    string,
    userLogin:  string	
}

export type CommentViewModel ={
    id:                 string,
    content:	        string
    commentatorInfo:	CommentatorInfo,
    createdAt:	        string
}

export type CommentFullModel ={
    id:                 string,
    content:	        string
    commentatorInfo:	CommentatorInfo,
    createdAt:	        string,
    parentPostId:       string
}


export type CommentInputModel = {
    content:	string    //maxLength: 300, minLength: 20
}
