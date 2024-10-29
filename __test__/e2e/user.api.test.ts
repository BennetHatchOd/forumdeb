import request from "supertest";
import { app } from "../../src/app";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {MongoClient} from 'mongodb'
import { UserEndPoint } from './classes/userClass'
import { initialize } from "./initialize";


describe('/users', () => {
    
    let server:  MongoMemoryServer
    let uri : string
    let client: MongoClient
    let userTest: UserEndPoint
    userTest = new UserEndPoint()
    
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

    
    // it('c0.should return 200 and empty array', async () => { // watch all blogs [get.blog]
    //     await userTest.getItems()    
    // })
 
    it('c1.should return 201 and created objects', async () => { // create new users
        await userTest.createItem(2);
        await userTest.createItem(0);
        await userTest.createItem(3);
    })
    
    it('c2.should return 200 and tokens', async () => { // 
        await userTest.checkLogin(0);
        await userTest.checkLogin(1);
        await userTest.checkLogin(2);
    })
    

    //  it('a2.should return 201 and created object', async () => { // create the second new blog [post.blog]
    //     await postTest.createItem(1, undefined, 'top')   
    // })
    
    it('c3.should return 401', async () => {  //       
        await userTest.checkLoginFaultPassword(0) 
    })


    it('c4.should return 401', async () => {  //       
        await userTest.checkLoginFaultLogin(1) 
    })

    it('c5.should return 200 and object', async () => {  
    
        await userTest.aboutMe(1)
    })

    it('c5.should return 401', async () => {  
    
        await userTest.aboutMeFault(1)
    })
        
    // it('a5.shouldn\'t delete blog and return 401', async () => { // delete the third blog  with wrong Authorization [delete.blog]
    //     await postTest.deleteNoItemOrBadAuth(true)
    // })
    
    // it('a6.should delete blog and return 204', async () => { // delete the last blog [delete.blog]     
    //     await postTest.deleteIDitem(postTest.getNumberItems() - 1)
    // })
    
    // it("a7.shouldn't delete not exist blog and return 404", async () => { // delete not existing blog [delete.blog]
    //     await postTest.deleteNoItemOrBadAuth(false, '53hrfijy6tghu6ghtrfdeswl')
    // })
        
    // it('a8.should watch not exist blog and return 404', async () => { // watch non exist item of blogs with bad Id [get.blog/hj]
    //     await postTest.getItemByBadId('gyfygu7')    
    
    // })
      
    // it('a9.should watch the blog return 200 and object', async () => { // watch the first blog  [get.blog/id]
    //     await postTest.getItemById(0)
    // })
    
    
    // it('a10.should return 200 and array of all object', async () => { // watch all blogs
    //     await postTest.getItems({sortBy: 'title'})       
    //     })
    
    
    // it("a11.shouldn't create a blog with incorrect datas and  return 400 and return object of errors", async () => { // create a bad blog [post.blog]
    //     await postTest.createBADitem(0)
    //     await postTest.createBADitem(1)
    //     await postTest.createBADitem(2)
    // })
    
    // it('a12.should edit the fisrt blog return 204', async () => { // edit the fisrt blog [put.blog]
    
    //     await postTest.editItem({ inView: 1, inCorrect: 4, title: 'editedTitle', shortDescription: 'anything' })
    // })

    
    // it('a13.shouldn\'t edit the not exist blog and return 404', async () => { // edit the not exist blog [put.blog]

    //     await postTest.editItemByBadId('f4e6yerer6')
    // })

    // it('a14.shouldn\'t edit the exist blog without authorization and return 401', async () => { // edit the not exist blog [put.blog]

    //     await postTest.editItemNoAuth(0)
    // })

    // it('a15.should return 200 and array of all object', async () => { // watch all blogs
    
    //     await postTest.getItems()    
    // })

})   