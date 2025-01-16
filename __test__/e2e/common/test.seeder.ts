import { BlogInputType } from "../../../src/variety/blogs/types";
import { CommentInputType } from "../../../src/variety/comments/types";
import { PostInputType } from "../../../src/variety/posts/types";
import { UserInputType } from "../../../src/variety/users/types"

export const testSeeder = {
    createGoodUser(prefix: string = ''){
        return {
            login: prefix + 'lhfg',
            email: prefix + 'gh2@test.com',
            password: 'paSSword'
        }
    },

    createManyGoodUsers(n: number = 1){
        
        const users: Array<UserInputType> = [];
        
        for(let i = 0; i < n; i++)
            users.push({login: `lhfg${i}`,
                        email: `gh2${i}@test.com`,
                        password: `paSSword${i}`
        })
        return users;
    },

    createBadUser(){
        return {
            login: 'lhfg',
            email: 'gh2@test.com',
            password: 'paSS'
        }
    },

    createTitleDevices(){
        return ['Chrome 12', 'Chrome 34', 'Android 17', 'Android 5', 'IoS 6']
    },

    createManyComment(n: number = 1){

        const comments: Array<CommentInputType> = []

        for(let i = 0; i < n; i++)
            comments.push({content: `This is the comment number ${i}`})
        
        return comments
    },

    createManyBlogs(n: number = 1){

        const blogs: Array<BlogInputType> = []

        for(let i = 0; i < n; i++)
            blogs.push({name: `Blog ${i}`,           
                        description: `description for blog ${i}`,
                        websiteUrl:	`https://dff${i}.com`  })
        
        return blogs
    },

    createManyPostsForBlog(blogId: string, n: number = 1){

        const posts: Array<PostInputType> = []

        for(let i = 0; i < n; i++)
            posts.push({title:              `post ${i}`,           
                        shortDescription:   `shortdescription for post ${i}`,
                        content:	        `content for post ${i}`,
                        blogId:             blogId })
        return posts
    }
}