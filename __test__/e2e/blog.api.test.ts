import request from "supertest";
import { app } from "../../src/app";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {MongoClient} from 'mongodb'
import { BlogEndPoint } from "./blogClass";




let server:  MongoMemoryServer
let uri : string
let client: MongoClient

describe('/blogs', () => {
    const blogTest = new BlogEndPoint()
    beforeAll(async() =>{  // clear db-array
        
        server = await MongoMemoryServer.create({
            binary: {
              version: '4.4.0', 
            },
          })
         
        uri = server.getUri()
        client = new MongoClient(uri)
        await client.connect()
        await request(app).delete('/testing/all-data')

    })

    afterAll(async() =>{
        await server.stop()
    })

    
    it('should return 200 and empty array', async () => { // watch all blogs [get.blog]
        await blogTest.getBlogs()    
    })
 
    it('should return 201 and created object', async () => { // create the fisrt new blog [post.blog]
        await blogTest.createItem(0, undefined, "ho-ho-ho");
    })
    
     it('should return 201 and created object', async () => { // create the second new blog [post.blog]
        await blogTest.createItem(1, 'top')   
    })
    
    it('should return 401', async () => {  // create the third new blog without Authorization [post.blog]       
        await blogTest.createItemNoAuth(1) 
    })

    it('should return 201 and created object', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createItem(2);
    })
        
    it('shouldn\'t delete blog and return 401', async () => { // delete the third blog  with wrong Authorization [delete.blog]
        await blogTest.deleteNoBlog(true)
    })
    
    it('should delete blog and return 204', async () => { // delete the last blog [delete.blog]     
        await blogTest.deleteIDblog(blogTest.getNumberItems() - 1)
    })
    
    it("shouldn't delete not exist blog and return 404", async () => { // delete not existing blog [delete.blog]
        await blogTest.deleteNoBlog(false, '53hrfijy6tghu6ghtrfdeswl')
    })
        
      it('should watch not exist blog and return 404', async () => { // watch non exist item of blogs with bad Id [get.blog/hj]
        await blogTest.getBlogByBadId('gyfygu7')    
    
    })
      
    it('should watch the blog return 200 and object', async () => { // watch the first blog  [get.blog/id]
        await blogTest.getIDblog(0)
    })
    
    
    it('should return 200 and array of all object', async () => { // watch all blogs
        await blogTest.getBlogs({sortBy: 'name'})       
        })
    
    
    it("shouldn't create a blog with incorrect datas and  return 400 and return object of errors", async () => { // create a bad blog [post.blog]
        await blogTest.createBADblog(0)
        await blogTest.createBADblog(1)
        await blogTest.createBADblog(2)
    })
    
    it('should edit the fisrt blog return 204', async () => { // edit the fisrt blog [put.blog]
    
      await blogTest.editItem(0, 2, 'editName', 'anything')

    })

    it('shouldn\'t edit the not exist blog and return 404', async () => { // edit the not exist blog [put.blog]

        await blogTest.editItemByBadId('f4e6yerer6')
    })

    it('shouldn\'t edit the exist blog without authorization and return 401', async () => { // edit the not exist blog [put.blog]

        await blogTest.editItemNoAuth(1)
    })

    it('should create Post for Blogs, return 201 and created object', async () => {  // create the third new blog [post.blog]
    
        await blogTest.createPost(1, 5, 'postBlog');
    })
    it('should return 200 and array of all object', async () => { // watch all blogs
    
        await blogTest.getBlogs()    
    })

})   