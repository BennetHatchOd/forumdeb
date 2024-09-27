// import { BlogInputModel, BlogViewModel, PostInputModel } from "../../src/types"
// import request from "supertest";

// import { app } from "../../src/app";
// import { URL_PATH, HTTP_STATUSES } from "../../src/setting";

// class BlogTests {
//     private baseUrl: string;

//     constructor() {
//         //this.baseUrl = '/users'; // Базовый URL для всех запросов к эндпоинту пользователей
//     }

//     // async testGetAllUsers() {
//     //     const response = await request(app).get(this.baseUrl);
//     //     expect(response.status).toBe(200);
//     //     expect(Array.isArray(response.body)).toBe(true); // Проверяем, что возвращается массив
//     //     expect(response.body.length).toBeGreaterThan(0); // Проверяем, что есть хотя бы один пользователь
//     // }

//     async testCreateVarienry(reqNumber: number, resNumber: number, auth: boolean = true) {
        
//         const AuthorizationValue = auth ? this.Authorization.value : this.Authorization.bad

//         let createdResponse = await 
//                 request(app)
//                 .post(URL_PATH.blogs)
//                 .set('"Authorization"', AuthorizationValue)
//                 .send(this.blogInput[reqNumber])
//                 .expect(HTTP_STATUSES.CREATED_201);

//         this.createdItem[resNumber] = createdResponse.body;

//         expect(this.createdItem[resNumber]).toEqual({
//             id: expect.any(String),
//             name: this.blogInput[reqNumber].name,
//             description: this.blogInput[reqNumber].description,
//             websiteUrl: this.blogInput[reqNumber].websiteUrl,
//             createdAt: expect.any(String),
//             isMembership: false
//         })
//     }


//     async notCreateVarienty(reqNumber: number, resNumber: number, auth: boolean = true) {
        
//         const AuthorizationValue = auth ? this.Authorization.value : this.Authorization.bad

//         let res = await request(app)
//                         .post(URL_PATH.blogs)
//                         .set('"Authorization"', AuthorizationValue)
//                         .send(this.blogInput[reqNumber])
//                         .expect(HTTP_STATUSES.CREATED_201);

        

//         expect(res.body).toEqual({
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
//     }


//     // async testGetUserById(userId: string) {
//     //     const response = await request(app).get(${this.baseUrl}/${userId});
//     //     expect(response.status).toBe(200);
//     //     expect(response.body).toHaveProperty("name");
//     //     expect(response.body).toHaveProperty("email");
//     // }




//     private Authorization = {
//         value: "Basic YWRtaW46cXdlcnR5",
//         bad: "Df fef"
//     }

//     private createdItem: Array<BlogViewModel>
    
    
    
    
//     private blogInput: Array<BlogInputModel> = [{
//         name: "The mistake",
//         description: "blog shouldn't create",
//         websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"},
//         {
//             name: "The first",
//             description: "Copolla",
//             websiteUrl: "https://google.dcfghgfhgc.com"}, 
//             {
//                 name: "The second",
//                 description: "this blog by Tarantino",
//                 websiteUrl: "https://google.dcfghgfhgc.com" },
//                 {
//     name: "The thirt",
//     description: "this blog not by Tarantino",
//     websiteUrl: "https://google.com" }, 
//     {
//         name: "Correct",
//         description: "Gaidai",
//         websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"}
//     ]

//     private blogBadNameUrl: BlogInputModel ={
//     name: "",
//     description: "0123",
//     websiteUrl: "https://googlecom"}
    
//     private blogBadNameUrl2: BlogInputModel ={
//         name: "1234567890123456",
//         description: "0123",
//         websiteUrl: "https://google1234.hjghghjgjhy.jkgughjgjhhghjghjgjhjh56789012345678901234567890123456789012345678901234567890123456789012345678901234567890.com"}
        
//     }
    
//     export default BlogTests;

// // export const postInput: Array<PostInputModel> = [{
// //     title: "The mistake",
// //     shortDescription: "Gaidai",
// //     content: "https://fig.dedf.cfghgfhgc.net/34",
// //     blogId: ''},
// // {
// //     title: "The first",
// //     shortDescription: "Copolla",
// //     content: "https://google.dcfghgfhgc.com",
// //     blogId: ''},
// // {
// //     title: "The second",
// //     shortDescription: "this post by Tarantino",
// //     content: "https://google.dcfghgfhgc.com",
// //     blogId: ''},
// // {
// //     title: "The thirt",
// //     shortDescription: "this post not by Tarantino",
// //     content: "https://google.com",
// //     blogId: ''},
// // {
// //     title: "Correct",
// //     shortDescription: "Gaidai",
// //     content: "https://fig.dedf.cfghgfhgc.net/34",
// //     blogId:  ''}
// // ]  

// // const postBadTitleContent: PostInputModel = {
// //     title: "",
// //     shortDescription: "0123",
// //     content: "length_10112345678901123456789011234567890112345678901123456789011234567890112345678901123456789011234567891",
// //     blogId: ''
// // }

// // const postBadShort: PostInputModel = {
// //     title: "length_311245845269854125745612",
// //     shortDescription: "",
// //     content: "ttps://google123456789012345678901234567890123456789012",
// //     blogId: ''
// // }

// // const postBadBlogId: PostInputModel = {
// //     title: "Wrong",
// //     shortDescription: "Copolla",
// //     content: "httkfhujhgf jyfjyf",
// //     blogId: "123456789012345678901234"
// // }