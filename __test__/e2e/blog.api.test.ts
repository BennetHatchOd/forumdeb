import request from "supertest";
import {HTTP_STATUSES, URL_PATH} from '../../src/setting'
import { app } from "../../src/app";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {MongoClient} from 'mongodb'
import { BlogInputModel, BlogViewModel } from "../../src/types";
import { BlogEndPoint } from "./items";


const blogTest = new BlogEndPoint();

let server:  MongoMemoryServer
let uri : string
let client: MongoClient

describe('/blogs', () => {

    beforeAll(async() =>{  // clear db-array
        server = await MongoMemoryServer.create({
            binary: {
              version: '4.4.0', 
            },
          })
         
        uri = server.getUri()
        client = new MongoClient(uri)
        await client.connect();
        await request(app).delete('/testing/all-data');
        blogTest.onAuthorization()

    })

    afterAll(async() =>{
        await server.stop()
    })

    
    it('should return 200 and empty array', async () => { // watch all blogs [get.blog]
        await blogTest.getBlogs()    
    })
 

    it('should return 201 and created object', async () => { // create the fisrt new blog [post.blog]
        await blogTest.createItem(0);
    })
    
     it('should return 201 and created object', async () => { // create the second new blog [post.blog]
        await blogTest.createItem(1)   
    })
    
    it('should return 401', async () => {  // create the third new blog without Authorization [post.blog]       
        await blogTest.createItemNoAuth(1) 
    })

    it('should return 201 and created object', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createItem(2);
    })
        
    //     it('shouldn\'t delete blog and return 401', async () => { // delete the third blog  with wrong Authorization [delete.blog]
    //     await request(app)
    //         .delete(`${URL_PATH.blogs}/${createdItem3.id}`)
    //         .set("Authorization", Authorization.false)
    //         .expect(HTTP_STATUSES.NO_AUTHOR_401);
    // })
    
    // it('should delete blog and return 204', async () => { // delete the third blog [delete.blog]
    //     await request(app)
    //         .delete(`${URL_PATH.blogs}/${createdItem3.id}`)
    //         .set("Authorization", Authorization.value)
    //         .expect(HTTP_STATUSES.NO_CONTENT_204);
    // })

    
    // it("shouldn't delete not exist blog and return 404", async () => { // delete not existing blog [delete.blog]
    //     await request(app)
    //         .delete(`${URL_PATH.blogs}/55`)
    //         .set("Authorization", Authorization.value)
    //         .expect(HTTP_STATUSES.NOT_FOUND_404);
    // })
    
    
    //   it('should watch not exist blog and return 404', async () => { // watch non exist item of blogs with bad Id [get.blog/hj]
    //     const res = await request(app)
    //             .get(`${URL_PATH.blogs}/mjjhjn`)
    //             .expect(HTTP_STATUSES.NOT_FOUND_404);    
    
    // })
    
    // it('should watch not exist blog and return 404', async () => { // watch non exist item of blogs [get.blog/hj]
    //     const res = await request(app)
    //             .get(`${URL_PATH.blogs}/123456789012345678901234`)
    //             .expect(HTTP_STATUSES.NOT_FOUND_404);    
    
    // })
    
    
    // it('should watch the blog return 200 and object', async () => { // watch the first blog  [get.blog/id]
    //     const res = await request(app)
    //             .get(`${URL_PATH.blogs}/${createdItem1.id}`)
    //             .expect(HTTP_STATUSES.OK_200);  
    
    //             expect(res.body).toEqual(createdItem1);
    
    // })
    
    
    // it('should return 200 and array of all object', async () => { // watch all blogs
    //     await request(app)
    //             .get(URL_PATH.blogs)
    //             .expect(HTTP_STATUSES.OK_200, [createdItem1, createdItem2 ]);    
    //     })
    
    
    // it("shouldn't create a blog with incorrect datas and  return 400 and return object of errors", async () => { // create a bad blog [post.blog]
        
    //     const data: BlogInputModel = {
    //                     name: "",
    //                     description: "0123",
    //                     websiteUrl: "https://googlecom"
    //         }
        
    //         let res = await request(app)
    //                         .post(URL_PATH.blogs)
    //                         .set("Authorization", Authorization.value)
    //                         .send(data)
    //                         .expect(HTTP_STATUSES.BAD_REQUEST_400);
        
    //         expect(res.body).toEqual({
    //                     "errorsMessages": [
    //               {
    //                     "message": expect.any(String),
    //                 "field": "name"
    //               },
    //               {
    //                     "message": expect.any(String),
    //                     "field": "websiteUrl"
    //                   },
    //             ]
    //           })
    // })

        
    // it("shouldn't create a blog with incorrect datas and  return 400 and return object of errors", async () => { // create a bad blog [post.blog]
        
    //     const data: BlogInputModel = {
    //                 name: "1234567890123456",
    //                 description: "0123",
    //                 websiteUrl: "ttps://google123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890.com432"
    //             }
    
    //     let res = await request(app)
    //                     .post(URL_PATH.blogs)
    //                     .set("Authorization", Authorization.value)
    //                     .send(data)
    //                     .expect(HTTP_STATUSES.BAD_REQUEST_400);

    //     expect(res.body).toEqual({
    //             "errorsMessages": [
    //                 {
    //                 "message": expect.any(String),
    //                 "field": "name"
    //                 },
    //                 {
    //                 "message": expect.any(String),
    //                 "field": "websiteUrl"
    //                 },
    //             ]
    //             })
    // })
    
    
    
    // it('should edit the fisrt blog return 204', async () => { // edit the fisrt blog [put.blog]
    
    //     const data: BlogInputModel = {
    //         name: "Correct",
    //         description: "Gaidai",
    //         websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
    //     }
    
    //     await  request(app)
    //             .put(`${URL_PATH.blogs}/${createdItem1.id}`)
    //             .set("Authorization", Authorization.value)
    //             .send(data)
    //             .expect(HTTP_STATUSES.NO_CONTENT_204);
        
    //     createdItem1.name = data.name
    //     createdItem1.description = data.description
    //     createdItem1.websiteUrl = data.websiteUrl

    // })

    
    // it('should edit the not exist blog and return 404', async () => { // edit the not exist blog [put.blog]

    //     const data: BlogInputModel = {
    //                 name: "The mistake",
    //                 description: "Gaidai",
    //                 websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
    //     }

    //     await request(app)
    //             .put(`${URL_PATH.blogs}/454`)
    //             .set("Authorization", Authorization.value)
    //             .send(data)
    //             .expect(HTTP_STATUSES.NOT_FOUND_404);
    // })

    // it('should return 200 and array of all object', async () => { // watch all blogs
    //     await request(app)
    //             .get(URL_PATH.blogs)
    //             .expect(HTTP_STATUSES.OK_200, [createdItem1, createdItem2 ]);    
    //     })

})   