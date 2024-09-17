import { ObjectId } from "mongodb"

export type BlogDBType = {
    _id:    ObjectId,
    name:   string,
    description: string,
     createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}

export type PostDBType = {
    _id:	ObjectId,
    title:	string,
    shortDescription: string,
    content: string,
    createdAt: string,
    blogId:	string,
    blogName:	string
}

export type UserDBType = {
    _id:	ObjectId,
    login:	string,
    email:	string,
    password: string,
    createdAt:	string
}

