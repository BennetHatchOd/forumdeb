import request from "supertest";
import {HTTP_STATUSES, URL_PATH} from '../../src/setting'
import { app } from "../../src/app";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {MongoClient} from 'mongodb'
import { BlogInputModel, BlogViewModel, PostInputModel, PostViewModel } from "../../src/types";




const Authorization = {
      value: "Basic YWRtaW46cXdlcnR5",
      false: "Df fef"
};
let server:  MongoMemoryServer
let uri : string
let client: MongoClient
describe('/posts', () => {

    beforeAll(async() =>{  // clear db-array
        server = await MongoMemoryServer.create({
            binary: {
              version: '4.4.0', 
            },
          })
         
        uri = server.getUri()
        client = new MongoClient(uri)
        await client.connect();
        await request(app).delete(URL_PATH.deleteAll);



    })

    afterAll(async() =>{
        await server.stop()
    })
    
    let createdItem1: PostViewModel;  
    let createdBlogId: string
    let createdBlogId2: string; 
    const createdBlogName: string ="The first";
    const createdBlogName2: string = "The second"     
    
    it('should return 201 and created object', async () => { // create the new blog [blog.post]
           const data: BlogInputModel = {
                name: "The first",
                description: "Copolla",
                websiteUrl: "https://google.dcfghgfhgc.com",
        }
        
        let createdResponse = await 
                request(app)
                .post(URL_PATH.blogs)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201);

        createdBlogId = createdResponse.body.id
    })

    it('should return 201 and created object', async () => { // create the second new blog [blog.post]
        const data: BlogInputModel = {
             name: "The second",
             description: "J.Copolla",
             websiteUrl: "https://google.dcgc.com",
     }
     
     let createdResponse = await 
             request(app)
             .post(URL_PATH.blogs)
             .set("Authorization", Authorization.value)
             .send(data)
             .expect(HTTP_STATUSES.CREATED_201);

     createdBlogId2 = createdResponse.body.id
 })           

    it('should return 200 and empty array', async () => { // watch all posts [get.post]
        await request(app)
                .get(URL_PATH.posts)
                .expect(HTTP_STATUSES.OK_200, []);    
    })
 
    it('should return 201 and created object', async () => { // create the fisrt new post [post.post]
        
        const data: PostInputModel = {
                    title: "The first",
                    shortDescription: "Copolla",
                    content: "https://google.dcfghgfhgc.com",
                    blogId: createdBlogId
        }
        
        let createdResponse = await 
                request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201);

        createdItem1 = createdResponse.body;

        expect(createdItem1).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: expect.any(String),
            blogId: createdBlogId,
            blogName: createdBlogName
        })
    })

    
    let createdItem2: PostViewModel;

    it('should return 201 and created object', async () => { // create the second new post [post.post]

        const data: PostInputModel = {
            title: "The second",
                    shortDescription: "this post by Tarantino",
                    content: "https://google.dcfghgfhgc.com",
                    blogId: createdBlogId2
                }

        let createdResponse2 = await 
                request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201);

        createdItem2 = createdResponse2.body;

        expect(createdItem2).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: expect.any(String),
            blogId: createdBlogId2,
            blogName: createdBlogName2
        })
    })

   
    let createdItem3: PostViewModel;

    it('should return 401', async () => {  // create the third new post without Authorization [post.post]
    
        const data: PostInputModel = {
                title: "The thirt",
                shortDescription: "this post not by Tarantino",
                content: "https://google.com",
                blogId: createdBlogId
            }

        await request(app)
                .post(URL_PATH.posts)
                .send(data)
                .expect(HTTP_STATUSES.NO_AUTHOR_401);

    })

    it('should return 401', async () => {  // create the third new post with wrong Authorization [post.post]
    
        const data: PostInputModel = {
                title: "The thirt",
                shortDescription: "this post not by Tarantino",
                content: "https://google.com",
                blogId: createdBlogId               
            }

        await request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.false)
                .send(data)
                .expect(HTTP_STATUSES.NO_AUTHOR_401);

    })


    it('should return 201 and created object', async () => {  // create the third new post [post.post]
    
        const data: PostInputModel = {
            title: "The thirt",
                shortDescription: "this post not by Tarantino",
                content: "https://google.com",
                blogId: createdBlogId
            }

        let createdResponse2 = await 
                request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201);

        createdItem3 = createdResponse2.body;

        expect(createdItem3).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: expect.any(String),
            blogId: createdBlogId,
            blogName: createdBlogName
        })
    })




    it('shouldn\'t delete post and return 401', async () => { // delete the third post  with wrong Authorization [delete.post]
        await request(app)
            .delete(`${URL_PATH.posts}/${createdItem3.id}`)
            .set("Authorization", Authorization.false)
            .expect(HTTP_STATUSES.NO_AUTHOR_401);
    })
   
    it('should delete post and return 204', async () => { // delete the third post [delete.post]
        await request(app)
            .delete(`${URL_PATH.posts}/${createdItem3.id}`)
            .set("Authorization", Authorization.value)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    })

    
    it("shouldn't delete not exist post and return 404", async () => { // delete not existing post [delete.post]
        await request(app)
            .delete(`${URL_PATH.posts}/55`)
            .set("Authorization", Authorization.value)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })
    
      
      it('should watch not exist post and return 404', async () => { // watch non exist item of posts with bad Id [get.post/hj]
        const res = await request(app)
                .get(`${URL_PATH.posts}/mjjhjn`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);    
        
    })

    it('should watch not exist post and return 404', async () => { // watch non exist item of posts [get.post/hj]
        const res = await request(app)
                .get(`${URL_PATH.posts}/123456789012345678901234`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);    
        
    })

     
    it('should watch the post return 200 and object', async () => { // watch the first post  [get.post/id]
        const res = await request(app)
                .get(`${URL_PATH.posts}/${createdItem1.id}`)
                .expect(HTTP_STATUSES.OK_200);  
                  
                expect(res.body).toEqual(createdItem1);
                    
    })

    
    it('should return 200 and array of all object', async () => { // watch all posts
        await request(app)
                .get(URL_PATH.posts)
                .expect(HTTP_STATUSES.OK_200, [createdItem1, createdItem2 ]);    
        })

    
    it("shouldn't create a post with incorrect datas and  return 400 and return object of errors", async () => { // create a bad post [post.post]
        
        const data: PostInputModel = {
                    title: "",
                    shortDescription: "0123",
                    content: "length_10112345678901123456789011234567890112345678901123456789011234567890112345678901123456789011234567891",
                    blogId: createdBlogId
        }
        
        let res = await request(app)
                        .post(URL_PATH.posts)
                        .set("Authorization", Authorization.value)
                        .send(data)
                        .expect(HTTP_STATUSES.BAD_REQUEST_400);

        expect(res.body).toEqual({
                "errorsMessages": [
                  {
                    "message": expect.any(String),
                    "field": "title"
                  },
                  {
                    "message": expect.any(String),
                    "field": "content"
                  },
                ]
              })
    })

        
    it("shouldn't create a post with incorrect datas and  return 400 and return object of errors", async () => { // create a bad post [post.post]
        
        const data: PostInputModel = {
                    title: "length_311245845269854125745612",
                    shortDescription: "",
                    content: "ttps://google123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890.com432",
                    blogId: createdBlogId
                }
        
        let res = await request(app)
                        .post(URL_PATH.posts)
                        .set("Authorization", Authorization.value)
                        .send(data)
                        .expect(HTTP_STATUSES.BAD_REQUEST_400);

        expect(res.body).toEqual({
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    },
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    },
                    {
                        "message": expect.any(String),
                        "field": "content"
                    },
                ]
                })
    })

     it('should edit the fisrt post return 204', async () => { // edit the fisrt post [put.post]
        
        const data: PostInputModel = {
            title: "Correct",
            shortDescription: "Gaidai",
            content: "https://fig.dedf.cfghgfhgc.net/34",
            blogId:  createdBlogId2
        }

        await  request(app)
                .put(`${URL_PATH.posts}/${createdItem1.id}`)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        
        createdItem1.title = data.title
        createdItem1.shortDescription = data.shortDescription
        createdItem1.content = data.content
        createdItem1.blogId = createdBlogId2
        createdItem1.blogName = createdBlogName2

    })

    it('should watch the post return 200 and object', async () => { // watch the first post  [get.post/id]
        const res = await request(app)
                .get(`${URL_PATH.posts}/${createdItem1.id}`)
                .expect(HTTP_STATUSES.OK_200);  
                  
                expect(res.body).toEqual(createdItem1);
                    
    })

    
    it('should edit the not exist post and return 404', async () => { // edit the not exist post [put.post]

        const data: PostInputModel = {
                    title: "The mistake",
                    shortDescription: "Gaidai",
                    content: "https://fig.dedf.cfghgfhgc.net/34",
                    blogId: createdBlogId
        }

        await request(app)
                .put(`${URL_PATH.posts}/454`)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it('should return 200 and array of all object', async () => { // watch all posts
        await request(app)
                .get(URL_PATH.posts)
                .expect(HTTP_STATUSES.OK_200, [createdItem1, createdItem2 ]);    
        })

    it("shouldn't create a post with incorrect blogID and  return 400 and return object of errors", async () => { // create a bad post [post.post]
    
        const data: PostInputModel = {
                    title: "The first",
                    shortDescription: "Copolla",
                    content: "https://google.dcfghgfhgc.com",
                    blogId: "123456789012345678901234_121"
        }
        
        let res = await 
                request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "blogId"
                        },
                    ]
                    })
    })

    it("shouldn't create a post with ID of not existed blog and  return 400 and return object of errors", async () => { // create a bad post [post.post]
    
        const data: PostInputModel = {
                    title: "The first",
                    shortDescription: "Copolla",
                    content: "https://google.dcfghgfhgc.com",
                    blogId: "123456789012345678901234"
        }
        
        let res = await 
                request(app)
                .post(URL_PATH.posts)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "blogId"
                        },
                    ]
                    })
    })

    it('shouldn\'t edit the fisrt post return 400', async () => { // edit the fisrt post [put.post]
        
        const data: PostInputModel = {
            title: "Correct",
            shortDescription: "Gaidai",
            content: "https://fig.dedf.cfghgfhgc.net/34",
            blogId:  "234a323654c3324d"
        }

        let res = await  request(app)
                .put(`${URL_PATH.posts}/${createdItem1.id}`)
                .set("Authorization", Authorization.value)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "blogId"
                        },
                    ]
                    })
    })

})