import request from "supertest";
import { app } from "../../../src/app";
import { BlogEndPoint } from "../classes/blogClass";
import { PostEndPoint } from "../classes/postClass";
import { initialize } from "../common/initialize";
import mongoose from "mongoose";
import { mongoURI } from "../../../src/setting/setting";

describe('/blogs', () => {
    
    // let server:  MongoMemoryServer
    // let uri : string
    // let client: MongoClient
    
    //jest.setTimeout(35000)
    let blogTest: BlogEndPoint
    let postTest: PostEndPoint

    beforeAll(async() =>{  // clear db-array
        
        // server = await MongoMemoryServer.create({
        //     binary: {
        //         version: '4.4.0', 
        //     },
        // })
        
        // uri = server.getUri()
        // client = new MongoClient(uri)
        await mongoose.connect(mongoURI)
        await request(app).delete('/testing/all-data')
        const tests = await initialize()
        blogTest = tests.blog 
        postTest = tests.post


    })

    afterAll(async() =>{
    //    await server.stop()
        await mongoose.connection.close()
    })
  
    it('b0.should return 200 and empty array', async () => { // watch all blogs [get.blog]
        await blogTest.getBlogs()    
    })
 
    it('b1.should return 201 and created object', async () => { // create the fisrt new blog [post.blog]
        await blogTest.createItem(0, undefined, "ho-ho-ho");
    })
    
    it('b2.should return 201 and created object', async () => { // create the second new blog [post.blog]
        await blogTest.createItem(1, 'top')   
    })
    
    it('b3.should return 401', async () => {  // create the third new blog without Authorization [post.blog]       
        await blogTest.createItemNoAuth(1) 
    })

    it('b4.should return 201 and created object', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createItem(2);
    })
        
    it('b5.shouldn\'t delete blog and return 401', async () => { // delete the third blog  with wrong Authorization [delete.blog]
        await blogTest.deleteNoBlog(true)
    })
    
    it('b6.should delete blog and return 204', async () => { // delete the last blog [delete.blog]     
        await blogTest.deleteIDblog(blogTest.getNumberItems() - 1)
    })
    
    it('b7.shouldn\'t delete not exist blog and return 404', async () => { // delete not existing blog [delete.blog]
        await blogTest.deleteNoBlog(false, '53hrfijy6tghu6ghtrfdeswl')
    })
        
    it('b8.should watch not exist blog and return 404', async () => { // watch non exist item of blogs with bad Id [get.blog/hj]
        await blogTest.getBlogByBadId('gyfygu7')    
    
    })
      
    it('b9.should watch the blog return 200 and object', async () => { // watch the first blog  [get.blog/id]
        await blogTest.getIDblog(0)
    })
    
    
    it('b10.should return 200 and array of all object', async () => { // watch all blogs
        await blogTest.getBlogs({sortBy: 'name'})       
        })
    
    
    it('b11.shouldn\'t create a blog with incorrect datas and  return 400 and return object of errors', async () => { // create a bad blog [post.blog]
        await blogTest.createBADblog(0)
        await blogTest.createBADblog(1)
        await blogTest.createBADblog(2)
    })
    
    it('b12.should edit the fisrt blog return 204', async () => { // edit the fisrt blog [put.blog]
    
      await blogTest.editItem(0, 2, 'editName', 'anything')

    })

    it('b13.shouldn\'t edit the not exist blog and return 404', async () => { // edit the not exist blog [put.blog]

        await blogTest.editItemByBadId('f4e6yerer6')
    })

    it('b14.shouldn\'t edit the exist blog without authorization and return 401', async () => { // edit the not exist blog [put.blog]

        await blogTest.editItemNoAuth(1)
    })

    it('b15.should create Post for Blogs, return 201 and created object', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createPost(1, 'the first post');
        await blogTest.createPost(1, 'the second post');
        await blogTest.createPost(1, 'the third post');
        await blogTest.createPost(2, 'the first post');
        // blogTest.showArrayItems()
        // postTest.showArrayItems()
        // postTest.getItems()

    })
    it('b15b.should return 200 and array of object', async () => { // watch posts for blog
        await blogTest.getPostBlog(1)       
        })


    it('b15a.shouldn\'t create Post for Blogs, return 201', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createBadPost('auth');
        await blogTest.createBadPost('bad');
        await blogTest.createBadPost('id', '7hu7yh6ghu8');
        

    })
    it('b16.should return 200 and array of all object', async () => { // watch all blogs
    
        await blogTest.getBlogs()    
    })

})   