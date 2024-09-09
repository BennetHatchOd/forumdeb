
 
type FieldError = {
    message: string,
    field: string
}

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl:	string
}

export type BlogViewModel = {
    id:	string,
    name: string,
    description: string,
    createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}


export type PostInputModel = {
    title:	string,
    shortDescription: string,
    content: string,
    blogId:	string,
}

export type PostViewModel = {
    id:	string,
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: string,
    blogId:	string,
    blogName:	string
}
