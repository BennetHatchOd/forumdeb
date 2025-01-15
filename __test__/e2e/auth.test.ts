import request from "supertest";
import mongoose from 'mongoose'
import { app } from "../../src/app";
import { testSeeder } from "./common/test.seeder";
import { UserInputType } from "../../src/variety/users/types";
import { authRepository, mailManager, userQueryRepository, userRepository } from "../../src/instances";
import { CodStatus } from "../../src/types/types";
import { AUTH_PATH, HTTP_STATUSES, mongoURI, URL_PATH } from "../../src/setting/setting.path.name";
import { TIME_LIFE_ACCESS_TOKEN } from "../../src/setting/setting";

describe('/auth', () => {
    
    // let server:  MongoMemoryServer
    // let uri : string
    // let client: MongoClient

    jest.setTimeout(35000)

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

    let code: string
    let accessToken: string
    let refreshToken: string
    let user: UserInputType
    let badUser: UserInputType
    mailManager.createConfirmEmail = jest.fn()
          .mockImplementation(
            (email: string, code: string) =>
              Promise.resolve(true)
          );
          
    it('User registration', async() => {
      
        

          user = testSeeder.createGoodUser()
          badUser = testSeeder.createBadUser()

        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.registration}`)
                        .send(user)
                        .expect(HTTP_STATUSES.NO_CONTENT_204);
                        
        expect(mailManager.createConfirmEmail).toHaveBeenCalledTimes(1);
        expect((mailManager.createConfirmEmail as jest.Mock).mock.calls[0][0]).toBe(user.email); 
        code = (mailManager.createConfirmEmail as jest.Mock).mock.calls[0][1];
        expect((await authRepository.findByConfirmCode(code)).codResult).toEqual(CodStatus.Ok)
        expect((await userRepository.checkUniq(user.login, user.email)).codResult).toEqual(CodStatus.BadRequest)
        expect((await userRepository.findIdByEmail(user.email)).codResult).toEqual(CodStatus.NotFound)
        
        
    })
    
    it('User registration with a bad password', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.registration}`)
        .send(badUser)
        .expect(HTTP_STATUSES.BAD_REQUEST_400);
    })
    
    it('User confirm with a bad code', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.confirm}`)
        .send({"code": '25'})
        .expect(HTTP_STATUSES.BAD_REQUEST_400);
        
        expect((await userRepository.checkUniq(user.login, user.email)).codResult).toEqual(CodStatus.BadRequest)
        expect((await userRepository.findIdByEmail(user.email)).codResult).toEqual(CodStatus.NotFound)
    })

    it('User confirm', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.confirm}`)
                    .send({"code": code})
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
        
        expect((await authRepository.findByConfirmCode(code)).codResult).toEqual(CodStatus.NotFound)
        expect((await userRepository.findIdByEmail(user.email)).codResult).toEqual(CodStatus.Ok)

    })
    
//     it('User login with a bad password', async() => {
        
//         const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
//                     .send({
//                           "loginOrEmail": user.email,
//                           "password": 'hgthjkg9'
//                         })
//                     .expect(HTTP_STATUSES.NO_AUTHOR_401);
//         expect(loginData.body.accessToken).toBeUndefined
//         expect(loginData.headers['set-cookie']).toBeUndefined
    
//     })

//     it('User login', async() => {
        
//         const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
//  //                   .set("Authorization", AuthPassword)
//                     .send({
//                           "loginOrEmail": user.email,
//                           "password": user.password
//                         })
//                     .expect(HTTP_STATUSES.OK_200);
//         accessToken = loginData.body.accessToken
//         const cookies = loginData.headers['set-cookie'][0].split('')
//         refreshToken = cookies.slice(cookies.indexOf('=') + 1,cookies.indexOf(';')).join('')
// //        console.log('aT = ', accessToken, '\n rt = ', refreshToken)
//     })

//     it('User asking about him with a wrong accessToken', async() => {
        
//         const loginData = await request(app).get(`${URL_PATH.auth}${AUTH_PATH.me}`)
//                     .set("Authorization", 'Bearer ' + 'gfd54')
//                     .expect(HTTP_STATUSES.NO_AUTHOR_401);

//     })

//     it('User asking about him', async() => {
        
//         const loginData = await request(app).get(`${URL_PATH.auth}${AUTH_PATH.me}`)
//                     .set("Authorization", 'Bearer ' + accessToken)
//                     .expect(HTTP_STATUSES.OK_200);
//         expect(loginData.body).toEqual(
//             {
//               "email": user.email,
//               "login": user.login,
//               "userId": expect.any(String)
//             })
//     })

//     it('User asking about him with an expired accessToken', async() => {
//         await new Promise((resolve) => {
//             setTimeout(resolve, TIME_LIFE_ACCESS_TOKEN * 1000 + 30)})

//         await request(app).get(`${URL_PATH.auth}${AUTH_PATH.me}`)
//                     .set("Authorization", 'Bearer ' + accessToken)
//                     .expect(HTTP_STATUSES.NO_AUTHOR_401);
//     })

//     it('update refrashToken', async() => {
        
//         const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.refresh}`)
//                     .set("Cookie", 'refreshToken='+ refreshToken)
//                     .expect(HTTP_STATUSES.OK_200);
//         accessToken = loginData.body.accessToken
//         const cookies = loginData.headers['set-cookie'][0].split('')
//         refreshToken = cookies.slice(cookies.indexOf('=') + 1,cookies.indexOf(';')).join('')
//     })

//     it('logout', async() => {
        
//         const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.logout}`)
//                     .set("Cookie", 'refreshToken='+ refreshToken)
//                     .expect(HTTP_STATUSES.NO_CONTENT_204);
//         expect(loginData.body.accessToken).toBeUndefined
//         expect(loginData.headers['set-cookie']).toBeUndefined
//     })
    
//     it('update refrashToken after logout', async() => {
        
//         const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.refresh}`)
//                     .set("Cookie", 'refreshToken='+ refreshToken)
//                     .expect(HTTP_STATUSES.NO_AUTHOR_401);
//         expect(loginData.body.accessToken).toBeUndefined
//         expect(loginData.headers['set-cookie']).toBeUndefined
//     })

//     it('User registration with burst attack', async() => {
            
//         const users = testSeeder.createManyGoodUsers(6)
        
//         await new Promise((resolve) => {
//             setTimeout(resolve, 10500)})

//         for(let i = 0; i <= 4; i++ ){
//             await request(app).post(`${URL_PATH.auth}${AUTH_PATH.registration}`)
//                             .send(users[i])
//                             .expect(HTTP_STATUSES.NO_CONTENT_204);

//         }
                      
//         await request(app).post(`${URL_PATH.auth}${AUTH_PATH.registration}`)
//                         .send(users[5])
//                         .expect(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
                        
//   })

})