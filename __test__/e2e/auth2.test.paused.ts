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
        expect(mailManager.createPasswordRecovery).toHaveBeenCalledTimes(1);        
    })
   
    it('Password confirm with a wrong code', async() => {
        
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.resentPassword}`)
                    .send({"newPassword": "hgjghfik8",
                           "code": '25'})
                    .expect(HTTP_STATUSES.BAD_REQUEST_400);
                
    })

    it('the user successfully logs in with the old password', async() => {
            
        const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                        .send({
                              "loginOrEmail": user.email,
                              "password": user.password
                            })
                        .expect(HTTP_STATUSES.OK_200);
        })


    it('Password confirm', async() => {
        await request(app).post(`${URL_PATH.auth}${AUTH_PATH.resentPassword}`)
                    .send({"newPassword": "hgjghfik8",
                           "recoveryCode": code})
                    .expect(HTTP_STATUSES.NO_CONTENT_204);
                
    })

       it('the user unsuccessfully logs in with the old password', async() => {
            
        const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                        .send({
                              "loginOrEmail": user.email,
                              "password": user.password
                            })
                        .expect(HTTP_STATUSES.NO_AUTHOR_401);
        })

        it('the user successfully logs in with the new password', async() => {
            
            const loginData = await request(app).post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                            .send({
                                  "loginOrEmail": user.email,
                                  "password": "hgjghfik8"
                                })
                            .expect(HTTP_STATUSES.OK_200);
            })
    
})