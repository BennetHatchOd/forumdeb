import request from "supertest";
import { BlogInputType } from "../../../src/variety/blogs/types";
import { CommentInputType } from "../../../src/variety/comments/types";
import { PostInputType } from "../../../src/variety/posts/types";
import { UserInputType } from "../../../src/variety/users/types";
import { testSeeder } from "./test.seeder";
import { AUTH_PATH, HTTP_STATUSES, URL_PATH } from "../../../src/setting/setting.path.name";
import { app } from "../../../src/app";
import { AuthPassword } from "./test.setting";

export async function fillSystem(blogs: BlogInputType[],
                           posts: PostInputType[], 
                           users: UserInputType[],
                        comments: CommentInputType[],
                     accessToken: string[],
                      commentsId: Array<string>){

    // creating blog                    
       
    const blogCreate = await request(app).post(URL_PATH.blogs)
                                    .set("Authorization", AuthPassword)                                
                                    .send(blogs[0]) 
                                    .expect(HTTP_STATUSES.CREATED_201)
                    
    // creating post                                
    posts[0].blogId = blogCreate.body.id

    const postCreate = await request(app).post(URL_PATH.posts)
                                    .set("Authorization", AuthPassword)
                                    .send(posts[0]) 
                                    .expect(HTTP_STATUSES.CREATED_201)

    // creating users & accesstokens

    for(let i =0; i < 5; i++){
        await request(app).post(`${URL_PATH.users}`)
                        .set("Authorization", AuthPassword)
                        .send(users[i])
                        .expect(HTTP_STATUSES.CREATED_201);

        const token = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                        .send({
                            "loginOrEmail": users[i].login,
                            "password":     users[i].password
                        })
        accessToken.push(token.body.accessToken)
    }
    
    // creating comments
     
    for(let i =0; i < 4; i++){
        const commentCreate = await request(app).post(`${URL_PATH.posts}/${postCreate.body.id}/comments`)
                        .set("Authorization", 'Bearer ' + accessToken[i])
                        .send(comments[i])
                        .expect(HTTP_STATUSES.CREATED_201);
        
        commentsId.push(commentCreate.body.id)
    }
}