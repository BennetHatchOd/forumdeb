import request from "supertest";
import mongoose from 'mongoose'
import { app } from "../../src/app";
import { testSeeder } from "./common/test.seeder";
import { UserInputType } from "../../src/variety/users/types";
import { authRepository, mailManager, userQueryRepository, userRepository } from "../../src/instances";
import { CodStatus } from "../../src/types/types";
import { AUTH_PATH, HTTP_STATUSES, mongoURI, URL_PATH } from "../../src/setting/setting.path.name";
import { TIME_LIFE_ACCESS_TOKEN } from "../../src/setting/setting";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CommentInputType } from "../../src/variety/comments/types";
import { PostInputType } from "../../src/variety/posts/types";
import { BlogInputType } from "../../src/variety/blogs/types";
import { fillSystem } from "./common/fillSystem";
import { Rating } from "../../src/variety/likes/types";
import { checkCommentLike } from "./common/helper";

describe('/likes', () => {
    
    let server:  MongoMemoryServer
    let uri : string
    // let client: MongoClient

    // jest.setTimeout(35000)

    beforeAll(async() =>{  // clear db-array
        
        server = await MongoMemoryServer.create()//{
            //  binary: {
            //          version: '6.1.0', 
            // },
        //})
        
        uri = server.getUri()
        // client = new MongoClient(uri,)
        await mongoose.connect(uri)
        await request(app).delete('/testing/all-data')


    })

    afterAll(async() =>{
    //    await server.stop()
        await mongoose.connection.close()
        await server.stop()
    })

    // let code: string
    // let accessToken: string
    // let refreshToken: string
    let users: Array<UserInputType> = testSeeder.createManyGoodUsers(5)
    let accessToken: Array<string> = []
    let commentsId: Array<string> = []
    let comments: Array<CommentInputType> = testSeeder.createManyComment(4)
    let posts: Array<PostInputType> = testSeeder.createManyPostsForBlog("")
    let blogs: Array<BlogInputType> = testSeeder.createManyBlogs()
    // mailManager.createConfirmEmail = jest.fn()
    //       .mockImplementation(
    //         (email: string, code: string) =>
    //           Promise.resolve(true)
    //       );

    it('Create sistem of blog, post and comments', async() => {    
        
        await fillSystem(blogs, posts, users, comments, accessToken, commentsId)
        
        const commentResponce = await request(app)
                                    .get(`${URL_PATH.comments}/${commentsId[0]}`)
                                    .set("Authorization", 'Bearer ' + accessToken[1])
                                    .expect(HTTP_STATUSES.OK_200);
        const comment = commentResponce.body                
        expect(comment).toEqual({id: expect.any(String),
                                content: comments[0].content,
                                commentatorInfo: {
                                    userId: expect.any(String),
                                    userLogin: users[0].login
                                },
                                createdAt: expect.any(String),
                                likesInfo: {
                                    likesCount: 0,
                                    dislikesCount: 0,
                                    myStatus: "None"
                                }})
    })

    it('Check like and dislike comments', async() => {  
        
        let status = Rating.Like
        expect(await checkCommentLike(commentsId[0], accessToken[1], status)).toEqual({
                                                                                        likesCount: 1,
                                                                                        dislikesCount: 0,
                                                                                        myStatus: status
                                                                                                })
        status = Rating.Dislike
        expect(await checkCommentLike(commentsId[0], accessToken[1], status)).toEqual({
                                                                                        likesCount: 0,
                                                                                        dislikesCount: 1,
                                                                                        myStatus: status
                                                                                                })

        status = Rating.None
        expect(await checkCommentLike(commentsId[0], accessToken[1], status)).toEqual({
                                                                                        likesCount: 0,
                                                                                        dislikesCount: 0,
                                                                                        myStatus: status
                                                                                                })

        status = Rating.Like
        expect(await checkCommentLike(commentsId[0], accessToken[1], status)).toEqual({
                                                                                        likesCount: 1,
                                                                                        dislikesCount: 0,
                                                                                        myStatus: status
                                                                                                })
        status = Rating.Like
        expect(await checkCommentLike(commentsId[0], accessToken[1], status)).toEqual({
                                                                                        likesCount: 1,
                                                                                        dislikesCount: 0,
                                                                                        myStatus: status
                                                                                                })

  


    })
})