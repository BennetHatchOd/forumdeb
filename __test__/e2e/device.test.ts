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
import { register } from "module";
import { de } from "date-fns/locale";
import { DeviceViewModel } from "../../src/variety/devices/types";
import { compareArr } from "./common/helper";

describe('/device', () => {
    
    let server:  MongoMemoryServer
    let uri : string
    let client: MongoClient

    jest.setTimeout(20000)

    let deviceId: string
    let accessToken: string
    let refreshToken: string
    let user: UserInputModel = testSeeder.createGoodUser()
    let user2: UserInputModel = testSeeder.createGoodUser('ff') 
    let devices = testSeeder.createTitleDevices()
    let RFtokens: Array<string> = []
    let numberDevices = devices.length
    
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
 
    it('Create 2 users', async() => {
 
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
          
          
        const createResponse2 = await request(app).post(`${URL_PATH.users}`)
                                .set("Authorization", AuthPassword)
                                .send(user2)
                                .expect(HTTP_STATUSES.CREATED_201);
    
        expect(createResponse2.body).toEqual({
            "id": expect.any(String),
            "login": user2.login,
            "email": user2.email,
            "createdAt": expect.any(String)
            })
 
    })
 
    it('User login many devices', async() => {

        for(let i = 0; i < numberDevices; i++){
            const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                        .set('user-agent', devices[i]) 
                        .send({
                            "loginOrEmail": user.email,
                            "password": user.password
                            })
                        .expect(HTTP_STATUSES.OK_200);
            accessToken = loginData.body.accessToken
            const cookies = loginData.headers['set-cookie'][0].split('')
            refreshToken = cookies.slice(cookies.indexOf('=') + 1,cookies.indexOf(';')).join('')
            RFtokens.push(refreshToken)
        }
   })


   it('User2 login 1 device', async() => {

    await new Promise((resolve) => {
                setTimeout(resolve, 10500)})
    const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                .set('user-agent', 'Poco') 
                .send({
                    "loginOrEmail": user2.email,
                    "password": user2.password
                    })
                .expect(HTTP_STATUSES.OK_200);
        const cookies = loginData.headers['set-cookie'][0].split('')
        refreshToken = cookies.slice(cookies.indexOf('=') + 1,cookies.indexOf(';')).join('')
    })

    it('Read session of user2', async() => {
    
        const sessions = await request(app).get(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ refreshToken) 
                    .expect(HTTP_STATUSES.OK_200);
        expect(sessions.body.length).toBe(1)
        expect(sessions.body[0].title).toBe('Poco')
        deviceId = sessions.body[0].deviceId
    })

    it("user can't terminate device session of user2", async() => {
        
        await request(app).delete(`${URL_PATH.devices}/${deviceId}`)
                .set("Cookie", 'refreshToken=' + RFtokens[1]) 
                .expect(HTTP_STATUSES.FORBIDDEN);
    })

    it("user2 terminate device session of user2", async() => {
    
        await request(app).delete(`${URL_PATH.devices}/${deviceId}`)
                    .set("Cookie", 'refreshToken='+ refreshToken) 
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
        const sessions = await request(app).get(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ refreshToken) 
                    .expect(HTTP_STATUSES.NO_AUTHOR_401);
    })

    it('Read sessions of user', async() => {
    
        const sessions = await request(app).get(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ RFtokens[3]) 
                    .expect(HTTP_STATUSES.OK_200);
        expect(sessions.body.length).toBe(numberDevices)
       // console.log('sessions= ', sessions.body)
    })

    it('logout from one session', async() => {
        
        const sessionLogout = 3
        const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.logout}`)
                    .set("Cookie", 'refreshToken='+ RFtokens[sessionLogout])
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
        expect(loginData.body.accessToken).toBeUndefined
        expect(loginData.headers['set-cookie']).toBeUndefined
        devices.splice(sessionLogout,1)
        RFtokens.splice(sessionLogout,1)
        numberDevices--
    })
    
    it('Read sessions of current user after logout', async() => {
    
        const sessions = await request(app).get(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ RFtokens[1]) 
                    .expect(HTTP_STATUSES.OK_200);
        expect(sessions.body.length).toBe(numberDevices)
        
        const check = compareArr(devices, sessions.body)
        expect(check).toBe(numberDevices)
    })

    it("user terminate all device sessions except current", async() => {
    
        await request(app).delete(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ RFtokens[1]) 
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
        const sessions = await request(app).get(`${URL_PATH.devices}`)
                    .set("Cookie", 'refreshToken='+ RFtokens[1]) 
                    .expect(HTTP_STATUSES.OK_200);
                    expect(sessions.body.length).toBe(1)
    })
})
