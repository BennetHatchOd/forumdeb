export type PostInputModel = {
    title:	string,                 // length 1-30
    shortDescription: string,       // length 1-100
    content: string,                // length 1-1000
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

export type BlogPostInputModel = {
    title:	string,                 // length 1-30
    shortDescription: string,       // length 1-100
    content: string,                // length 1-1000
}
