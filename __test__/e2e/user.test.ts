import request from "supertest";
import { app } from "../../src/app";
import { testSeeder } from "./common/test.seeder";
import { UserInputType } from "../../src/variety/users/types";
import { AuthPassword } from "./common/test.setting";
import mongoose from "mongoose";
import { HTTP_STATUSES, mongoURI, URL_PATH } from "../../src/setting/setting.path.name";

describe('/user', () => {
    
    // let server:  MongoMemoryServer
    // let uri : string
    // let client: MongoClient

    //jest.setTimeout(35000)

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


    })

    afterAll(async() =>{
    //    await server.stop()
        await mongoose.connection.close()
    })


    let user: UserInputType = testSeeder.createGoodUser()
    let badUser: UserInputType = testSeeder.createBadUser()
 

    it('Users reading', async() => {
 
        const createResponse = await request(app).get(`${URL_PATH.users}?pageSize=50`)
                            .set("Authorization", AuthPassword)
                            .expect(HTTP_STATUSES.OK_200);   
 
    })

    it('User create', async() => {
 
        const createResponse = await request(app).post(`${URL_PATH.users}`)
                            .set("Authorization", AuthPassword)
                            .send(user)
                            .expect(HTTP_STATUSES.CREATED_201);
                        
        expect(createResponse.body).toEqual({
            "id": expect.any(String),
            "login": user.login,
            "email": user.email,
            "createdAt": expect.any(String)
          })
 
    })

    it('Users reading', async() => {
 
        const createResponse = await request(app).get(`${URL_PATH.users}?pageSize=50`)
                            .set("Authorization", AuthPassword)
                            .expect(HTTP_STATUSES.OK_200);   
 
    })

})