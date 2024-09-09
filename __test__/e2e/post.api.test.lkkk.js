"use strict";
// import request from "supertest";
// import {HTTP_STATUSES, URL_PATH} from '../../src/setting';
// import {app} from '../../src/app'
// describe('/posts', () => {
//     // beforeAll(async() =>{  // clear db-array
//     //     await request(app).delete('/testing/all-data');
//     // })
//     // watch all posts [get.blog]
//     it('should return 200 and empty array', async () => { 
//         await request(app)
//                 .get(URL_PATH.posts)
//                 .expect(HTTP_STATUSES.OK_200, []);    
//     })
//     // create the fisrt new blog [post.blog]
//     let createdBlog_: any = null
//     let createdPost1: any = null;  
//     it('should return 201 and created object', async () => { 
//         let res = await 
//                 request(app)
//                 .post(URL_PATH.blogs)
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     name: "blogForP",
//                     description: "Nyxx",
//                     websiteUrl: "https://nyxx.com"
//                 })
//                 .expect(HTTP_STATUSES.CREATED_201);
//          createdBlog_ = res.body;
//           res = await request(app)
//                 .post(URL_PATH.posts)
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     "title": "newPost",
//                     "shortDescription": `new post for bloq ${createdBlog_.id}`,
//                     "content": "hjkgjhghj",
//                     "blogId": createdBlog_.id
//                 })
//                 .expect(HTTP_STATUSES.CREATED_201);
//                 createdPost1 = res.body;  
//         expect(createdPost1).toEqual({
//             id: expect.any(String),
//             "title": "newPost",
//             "shortDescription": `new post for bloq ${createdBlog_.id}`,
//             "content": "hjkgjhghj",
//             "blogId": createdBlog_.id,
//             "blogName": createdBlog_.name
//         })
//     })
//     // create the second new blog [post.blog]
//     let createdBlog2: any = null;
//     it('should return 201 and created object', async () => { 
//         let createdResponse2 = await 
//                 request(app)
//                 .post('/blogs')
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     name: "The second",
//                     description: "this blog by Tarantino",
//                     websiteUrl: "https://google.dcfghgfhgc.com"
//                 })
//                 .expect(HTTP_STATUSES.CREATED_201);
//         createdBlog2 = createdResponse2.body;
//         expect(createdBlog2).toEqual({
//             id: expect.any(String),
//             name: "The second",
//             description: "this blog by Tarantino",
//             websiteUrl: "https://google.dcfghgfhgc.com"
//         })
//     })
//     // create the third new blog [post.blog]
//     let createdBlog3: any = null;
//     it('should return 201 and created object', async () => { 
//         let createdResponse2 = await 
//                 request(app)
//                 .post('/blogs')
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     name: "The thirt",
//                     description: "this blog not by Tarantino",
//                     websiteUrl: "https://google.com"
//                 })
//                 .expect(HTTP_STATUSES.CREATED_201);
//         createdBlog3 = createdResponse2.body;
//         expect(createdBlog3).toEqual({
//             id: expect.any(String),
//             name: "The thirt",
//             description: "this blog not by Tarantino",
//             websiteUrl: "https://google.com"
//         })
//     })
//     // delete the third blog [delete.blog]
//     it('should return 204', async () => { 
//         await request(app)
//             .delete(`/blogs/${createdBlog3.id}`)
//             .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//             .expect(HTTP_STATUSES.NO_CONTENT_204);
//     })
//     // delete not existing blog [delete.blog]
//     it('should return 404', async () => { 
//         await request(app)
//             .delete(`/blogs/55`)
//             .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//             .expect(HTTP_STATUSES.NOT_FOUND_404);
//     })
//       // watch non exist item of blogs [get.blog/hj]
//       it('should return 404', async () => {
//         const res = await request(app)
//                 .get('/blogs/mjjhjn')
//                 .expect(HTTP_STATUSES.NOT_FOUND_404);    
//     })
//      // watch the first blog  [get.blog/id]
//      it('should return 200 and object', async () => {
//         const res = await request(app)
//                 .get(`/blogs/${createdBlog1.id}`)
//                 .expect(HTTP_STATUSES.OK_200);  
//                 expect(res.body).toEqual({
//                     id: createdBlog1.id,
//                     name: "The first",
//                     description: "Copolla",
//                     websiteUrl: "https://google.dcfghgfhgc.com"
//                 })          
//     })
//     // watch all blogs
//     it('should return 200 and array of object', async () => { // watch all db [get.blog]
//         await request(app)
//                 .get('/blogs')
//                 .expect(HTTP_STATUSES.OK_200, [createdBlog1, createdBlog2 ]);    
//         })
//     // create a bad blog [post.blog]
//     it('should return 400 and return object of errors', async () => { 
//         let res = await request(app)
//                         .post('/blogs')
//                         .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                         .send({
//                             name: "",
//                             description: "0123",
//                             websiteUrl: "https://googlecom"
//                         })
//                         .expect(HTTP_STATUSES.BAD_REQUEST_400);
//         expect(res.body).toEqual({
//                 "errorsMessages": [
//                   {
//                     "message": expect.any(String),
//                     "field": "name"
//                   },
//                   {
//                     "message": expect.any(String),
//                     "field": "websiteUrl"
//                   },
//                 ]
//               })
//     })
//         // create a bad blog [post.blog]
//         it('should return 400 and return object of errors', async () => { 
//             let res = await request(app)
//                             .post('/blogs')
//                             .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                             .send({
//                                 name: "1234567890123456",
//                                 description: "0123",
//                                 websiteUrl: "ttps://google123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890.com432"
//                             })
//                             .expect(HTTP_STATUSES.BAD_REQUEST_400);
//             expect(res.body).toEqual({
//                     "errorsMessages": [
//                       {
//                         "message": expect.any(String),
//                         "field": "name"
//                       },
//                       {
//                         "message": expect.any(String),
//                         "field": "websiteUrl"
//                       },
//                     ]
//                   })
//         })
//     // edit the fisrt blog [post.blog]
//     it('should return 204', async () => { 
//         await  request(app)
//                 .put(`/blogs/${createdBlog1.id}`)
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     name: "Correct",
//                     description: "Gaidai",
//                     websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
//                 })
//                 .expect(HTTP_STATUSES.NO_CONTENT_204);
//         createdBlog1.name = "Correct";
//         createdBlog1.description = "Gaidai";
//         createdBlog1.websiteUrl = "https://fig.dedf.cfghgfhgc.net/34"
//     })
//     // edit the fisrt blog [post.blog]
//     it('should return 404', async () => { 
//         await request(app)
//                 .put(`/blogs/454`)
//                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
//                 .send({
//                     name: "The mistake",
//                     description: "Gaidai",
//                     websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
//                 })
//                 .expect(HTTP_STATUSES.NOT_FOUND_404);
//     })
// })
