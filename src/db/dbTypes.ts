import { ObjectId } from "mongodb"

export type BlogDBType = {
    name:   string,
    description: string,
     createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}

export type PostDBType = {
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: string,
    blogId:	string,
    blogName:	string
}

export type UserDBType = {
    login:	string,
    email:	string,
    password: string,
    createdAt:	string
}

