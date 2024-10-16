export type BlogDBModel = {
    name:   string,
    description: string,
    createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}

export type PostDBModel = {
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: string,
    blogId:	string,
    blogName:	string
}

export type UserDBModel = {
    login:	string,
    email:	string,
    password: string,
    createdAt:	string
}

export type UserUnconfirmedDBModel = {
    user:{
        login:	string,
        email:	string,
        password: string,
        createdAt:	string},
    confirmEmail: {
        code: string,
        expirationTime: string,
        countSendingCode: number
    }
}

export type CommentatorDBInfo ={
    userId:	    string,
    userLogin:  string	
}

export type CommentDBModel ={
    parentPostId:       string,
    content:	        string,
    commentatorInfo:	CommentatorDBInfo,
    createdAt:	        string,

}
