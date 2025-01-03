export type BlogInputType = {
    name: string,                   // length 1-15
    description: string,            // length 1-500
    websiteUrl:	string              // length 1-100, ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    createdAt: string,
    isMembership: boolean,
    websiteUrl:	string
}

export type BlogPostInputType = {
    title:	string,                 // length 1-30
    shortDescription: string,       // length 1-100
    content: string,                // length 1-1000
}

