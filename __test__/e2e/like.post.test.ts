import request from "supertest";
import mongoose from 'mongoose'
import { app } from "../../src/app";
import { testSeeder } from "./common/test.seeder";
import { UserInputType } from "../../src/variety/users/types";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CommentInputType } from "../../src/variety/comments/types";
import { PostInputType } from "../../src/variety/posts/types";
import { BlogInputType } from "../../src/variety/blogs/types";
import { fillSystem } from "./common/fillSystem";
import { Rating } from "../../src/variety/likes/types";
import { setEntityLike} from "./common/helper";
import { HTTP_STATUSES, URL_PATH } from "../../src/setting/setting.path.name";

describe('/likes', () => {
    
    let server:  MongoMemoryServer
    let uri : string
    // let client: MongoClient

     jest.setTimeout(35000)

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
    let postsId: string[] = []
    let users: Array<UserInputType> = testSeeder.createManyGoodUsers(8)
    let accessToken: Array<string> = []
    let commentsId: Array<string> = []
    let comments: Array<CommentInputType> = testSeeder.createManyComment(4)
    let posts: Array<PostInputType> = testSeeder.createManyPostsForBlog("", 4)
    let blogs: Array<BlogInputType> = testSeeder.createManyBlogs()

    it('Create system of blog, post and comments', async() => {    
        
        await fillSystem(blogs, posts, users, comments, accessToken, commentsId, postsId)
        const postResponce = await request(app)
                                    .get(`${URL_PATH.posts}/${postsId[0]}`)
                                    .set("Authorization", 'Bearer ' + accessToken[1])
                                    .expect(HTTP_STATUSES.OK_200);
        const post = postResponce.body                
        expect(post).toEqual(   {id: expect.any(String),
                                title: posts[0].title,
                                shortDescription: posts[0].shortDescription,
                                content: posts[0].content,
                                createdAt: expect.any(String),
                                blogId: posts[0].blogId,
                                blogName: blogs[0].name,
                                extendedLikesInfo: {
                                    likesCount: 0,
                                    dislikesCount: 0,
                                    myStatus: "None",
                                    newestLikes: []
                                }})
    })

    it('Check like and dislike posts', async() => {  
        
        let status = Rating.Like
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
                                                                                                    dislikesCount: 0,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })
        status = Rating.Dislike
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 0,
                                                                                                    dislikesCount: 1,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })

        status = Rating.None
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 0,
                                                                                                    dislikesCount: 0,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })

        status = Rating.Like
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
                                                                                                    dislikesCount: 0,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })
        status = Rating.Like
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
                                                                                                    dislikesCount: 0,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })
        status = Rating.Like
        expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
                                                                                                    dislikesCount: 0,
                                                                                                    myStatus: status,
                                                                                                    newestLikes: expect.any(Array) })                                                                                            
    })
                                                                                            
    // it('An unauthorized user is viewing the comment status', async() => { 

    //     const commentResponce = await request(app)
    //                                   .get(`${URL_PATH.comments}/${commentsId[0]}`)
    //                                   .expect(HTTP_STATUSES.OK_200);
    //     const comment = commentResponce.body                
    //     expect(comment.likesInfo).toEqual({ likesCount: 1,
    //                                         dislikesCount: 0,
    //                                         myStatus: Rating.None})    
    // })

    // it('Some users like and dislike comment', async() => {

    //     let status = Rating.Like
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[0], status)).toEqual({ likesCount: 2,
    //                                                                                     dislikesCount: 0,
    //                                                                                     myStatus: status })
    //     status = Rating.Like
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[2], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 0,
    //                                                                                     myStatus: status })
    //     status = Rating.Dislike
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[3], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 1,
    //                                                                                     myStatus: status })
    //     status = Rating.Dislike
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[4], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 2,
    //                                                                                     myStatus: status })
    //     status = Rating.Dislike
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[5], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 3,
    //                                                                                     myStatus: status })
    //     status = Rating.Dislike
    //     expect(await setCommentLike(URL_PATH.comments, commentsId[0], accessToken[6], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 4,
    //                                                                                     myStatus: status })

    // })

    // it('Some users like and dislike comments', async() => {

    //     let status = Rating.Like
    //     let users = [[1, 3, 4, 5, 6 ,7],
    //                  [2, 3, 4],
    //                  [2, 5]
    //                 ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setCommentLike(URL_PATH.comments, commentsId[i+1], accessToken[user], status)
    //         }
    //     }

    //     status = Rating.Dislike

    //     users = [[2],
    //              [1, 5, 6],
    //              [1, 2, 3, 4, 4, 5, 6]
    //             ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setCommentLike(URL_PATH.comments, commentsId[i+1], accessToken[user], status)
    //         }
    //     }

    //     status = Rating.None
    //     users = [[3],
    //              [6, 1],
    //              []
    //             ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setCommentLike(URL_PATH.comments, commentsId[i+1], accessToken[user], status)
    //         }
    //     }
    
    //     let commentResponce = await request(app).get(`${URL_PATH.comments}/${commentsId[0]}`).set("Authorization", 'Bearer ' + accessToken[2])
    //     expect(mapLikesInfo(commentResponce.body)).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 4,
    //                                                     myStatus: Rating.Like })

    //     commentResponce = await request(app).get(`${URL_PATH.comments}/${commentsId[1]}`).set("Authorization", 'Bearer ' + accessToken[3])
    //     expect(mapLikesInfo(commentResponce.body)).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.None })

    //     commentResponce = await request(app).get(`${URL_PATH.comments}/${commentsId[2]}`).set("Authorization", 'Bearer ' + accessToken[4])
    //     expect(mapLikesInfo(commentResponce.body)).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Like })

    //     commentResponce = await request(app).get(`${URL_PATH.comments}/${commentsId[3]}`).set("Authorization", 'Bearer ' + accessToken[5])
    //     expect(mapLikesInfo(commentResponce.body)).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 6,
    //                                                     myStatus: Rating.Dislike })

    //     commentResponce = await request(app).get(`${URL_PATH.comments}/${commentsId[1]}`)
    //     expect(mapLikesInfo(commentResponce.body)).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.None })
    // })

    //     it('Get all comments', async() => {

    //     let commentResponce = await request(app).get(`${URL_PATH.posts}/${postId[0]}/comments`)
    //                                             .set("Authorization", 'Bearer ' + accessToken[2])
        
    //     expect(mapLikesInfo(commentResponce.body.items[3])).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 4,
    //                                                     myStatus: Rating.Like })
    //     expect(mapLikesInfo(commentResponce.body.items[2])).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Dislike })       
    //     expect(mapLikesInfo(commentResponce.body.items[1])).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Like })
    //     expect(mapLikesInfo(commentResponce.body.items[0])).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 6,
    //                                                     myStatus: Rating.Dislike })
    // })
})