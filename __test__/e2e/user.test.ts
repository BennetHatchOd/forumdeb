import request from "supertest";
import { app } from "../../src/app";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {MongoClient} from 'mongodb'
import { mailManager } from "../../src/utility/mailManager";
import { testSeeder } from "./common/test.seeder";
import { UserInputModel } from "../../src/variety/users/types";
import { AUTH_PATH, HTTP_STATUSES, TIME_LIFE_ACCESS_TOKEN, URL_PATH } from "../../src/setting";
import { AuthPassword } from "./common/test.setting";
import { authRepository } from "../../src/variety/auth/authRepository";
import { CodStatus } from "../../src/types/interfaces";
import { userRepository } from "../../src/variety/users/repositories/userRepository";

describe('/auth', () => {
    
    let server:  MongoMemoryServer
    let uri : string
    let client: MongoClient

    jest.setTimeout(30000)

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


    let user: UserInputModel = testSeeder.createGoodUser()
    let badUser: UserInputModel = testSeeder.createBadUser()
 

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