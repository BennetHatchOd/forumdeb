export type BlogDBModel = {
    name:   string,
    description: string,
    createdAt: Date,
    isMembership: boolean,
    websiteUrl:	string
}

export type PostDBModel = {
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: Date,
    blogId:	string,
    blogName:	string
}

export type UserDBModel = {
    login:	string,
    email:	string,
    password: string,
    createdAt:	Date
}

export type UserUnconfirmedDBModel = {
    user:{
        login:	string,
        email:	string,
        password: string,
        createdAt:	Date},
    confirmEmail: {
        code: string,
        expirationTime: Date,
        countSendingCode: number
    }
}

export type CommentatorDBInfo ={
    userId:	    string,
    userLogin:  string	
}

export type CommentDBModel = {
    parentPostId:       string,
    content:	        string,
    commentatorInfo:	CommentatorDBInfo,
    createdAt:	        Date,

}

// export type TokenListDB = {
//     userId: string,
//     blackList: Array<BlackListModel>
// }

// export type BlackListModel = {
//     version: string,
//     expireTime: number
// }

export type requestAPIModelDB = {
    ip:     string, 
    url:    string, 
    date:   Date
}

export type activeSessionDB = {
    userId:     string,
    version:    string,
    deviceId:   string,
    deviceName: string,
    ip:         string,
    createdAt:  Date,
    expiresAt:  Date
}