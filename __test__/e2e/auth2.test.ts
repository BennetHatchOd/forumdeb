import request from "supertest";
import mongoose from 'mongoose'
import { app } from "../../src/app";
import { testSeeder } from "./common/test.seeder";
import { UserInputType } from "../../src/variety/users/types";
import { authRepository, mailManager, userRepository } from "../../src/instances";
import { CodStatus } from "../../src/types/types";
import { AUTH_PATH, HTTP_STATUSES, mongoURI, URL_PATH } from "../../src/setting/setting.path.name";
import { TIME_LIFE_ACCESS_TOKEN } from "../../src/setting/setting";
import { AuthPassword } from "./common/test.setting";

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
    let userId: string
    let accessToken: string
    let refreshToken: string
    let user: UserInputType
    let badUser: UserInputType
    mailManager.createPasswordRecovery = jest.fn()
          .mockImplementation(
            (email: string, code: string) =>
              Promise.resolve(true)
          );
          
    user = testSeeder.createGoodUser()
    
    it('User create', async() => {
            
        const responseAnswer = await request(app).post(`${URL_PATH.users}`)
                        .set("Authorization", AuthPassword)
                        .send(user)
                        .expect(HTTP_STATUSES.CREATED_201);
        expect(responseAnswer.body).toEqual(
                            {
                              "email": user.email,
                              "login": user.login,
                              "id": expect.any(String),
                              "createdAt": expect.any(String)
                            })
        userId = responseAnswer.body.id
    })

    it('requesting a new  password for the user', async() => {

        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.askNewPassword}`)
                            .send({email: user.email})
                            .expect(HTTP_STATUSES.NO_CONTENT_204);
        expect(mailManager.createPasswordRecovery).toHaveBeenCalledTimes(1);
        expect((mailManager.createPasswordRecovery as jest.Mock).mock.calls[0][0]).toBe(user.email); 
        code = (mailManager.createPasswordRecovery as jest.Mock).mock.calls[0][1];
        expect((await authRepository.findPasswordRecovery(code)).codResult).toEqual(CodStatus.Ok)
        expect((await authRepository.findPasswordRecovery(code)).data?.userId).toEqual(userId)
        
    })

    it('requesting a new  password for the wrong email', async() => {

        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.askNewPassword}`)
                            .send({email: "ft@com.ua"})
                            .expect(HTTP_STATUSES.NO_CONTENT_204);
        expect(mailManager.createPasswordRecovery).toHaveBeenCalledTimes(0);        
    })
   
    it('Password confirm with a wrong code', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.resentPassword}`)
                    .send({"newPassword": "hgjghfik8",
                           "code": '25'})
                    .expect(HTTP_STATUSES.BAD_REQUEST_400);
                
    })

    it('Password confirm', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.resentPassword}`)
                    .send({"newPassword": "hgjghfik8",
                           "code": '25'})
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
                
    })

//     it('User confirm', async() => {
        
//         await request(app).post(`${URL_PATH.auth}${AUTH_PATH.confirm}`)
//                     .send({"code": code})
//                     .expect(HTTP_STATUSES.NO_CONTENT_204);
        
//         expect((await authRepository.findByConfirmCode(code)).codResult).toEqual(CodStatus.NotFound)
//         expect((await userRepository.checkUniq(user.login, user.email)).codResult).toEqual(CodStatus.BadRequest)

//     })
    
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