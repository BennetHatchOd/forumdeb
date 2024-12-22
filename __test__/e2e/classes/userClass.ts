import {UserInputType, UserPasswordType, UserViewType} from '../../../src/variety/users/types'
import { app } from "../../../src/app";
import request from "supertest";
import { HTTP_STATUSES, URL_PATH } from '../../../src/setting';


export class UserEndPoint{
    private itemView: Array<UserPasswordType> = []
    private itemToken: Array<{userId:string, token:string}> = []
    private itemCorrect: Array<UserInputType> = []
    private AuthAdmin!: string

    constructor(){


        for(let i = 0; i < 10; i++){
            this.itemCorrect.push({
                login:      'log_' + i,                   
                email:      `fgt${i}@mail.g${i}.com`,            
                password:   `gjr${i}dfgf${i ** 7}f${(i ** i) % 2548 }`,
            })
        }

        this.onAuthorizationAdmin()
    }

    async initialize() {

    }

    async createItem(i: number = 0){
        
        const createItem: UserInputType = this.itemCorrect[i]

        let createdResponse = await 
                request(app)
                .post(URL_PATH.users)
                .set("Authorization", this.AuthAdmin)
                .send(createItem)
                .expect(HTTP_STATUSES.CREATED_201);

        let createdItem: UserPasswordType = {...createdResponse.body, 
                                                password: this.itemCorrect[i].password}
        this.itemView.push({...createdItem})

        expect(createdResponse.body).toEqual({
            id: expect.any(String),
            login: createItem.login,
            email: createItem.email,
            createdAt: expect.any(String),
        })
    }

    async checkLogin(numberInView: number = 0){

        const {login, password, email} = {...this.itemView[numberInView]}
        let createdResponse = await 
                request(app)
                .post(URL_PATH.auth + '/login')
                .set("Authorization", this.AuthAdmin)
                .send({loginOrEmail:login, password:password})
                .expect(HTTP_STATUSES.OK_200);
        this.itemToken.push({userId: this.itemView[numberInView].id, token:createdResponse.body.accessToken})
        
        await request(app)
                .post(URL_PATH.auth + '/login')
                .set("Authorization", this.AuthAdmin)
                .send({loginOrEmail:email, password:password})
                .expect(HTTP_STATUSES.OK_200);

    }

    async checkLoginFaultPassword(numberInView: number = 0){

        const {login, password} = {...this.itemView[numberInView]}
        await request(app)
                .post(URL_PATH.auth + '/login')
                .set("Authorization", this.AuthAdmin)
                .send({loginOrEmail:login, password:password + 'g'})
                .expect(HTTP_STATUSES.NO_AUTHOR_401);
    }

    async checkLoginFaultLogin(numberInView: number = 0){

        const {login, password} = {...this.itemView[numberInView]}
        await request(app)
                .post(URL_PATH.auth + '/login')
                .set("Authorization", this.AuthAdmin)
                .send({loginOrEmail:login + 'f', password:password})
                .expect(HTTP_STATUSES.NO_AUTHOR_401);
    }
 
    async aboutMe(numberInToken: number = 0){

        const {userId, token} = {...this.itemToken[numberInToken]}
        let foundResponse = await 
                request(app)
                .get(URL_PATH.auth + '/me')
                .set("Authorization", 'Bearer ' + token)
                .expect(HTTP_STATUSES.OK_200);

        const foundUser = this.itemView.find(c => c.id == userId)
        const foundItem = foundResponse.body
        expect(foundItem).toEqual({ email: foundUser?.email,
                                    login: foundUser?.login,
                                    userId: userId})
    }

    async aboutMeFault(numberInToken: number = 0){

        const {userId, token} = {...this.itemToken[numberInToken]}
        let foundResponse = await 
                request(app)
                .get(URL_PATH.auth + '/me')
                .set("Authorization", 'Bearer ' + token + 'u')
                .expect(HTTP_STATUSES.NO_AUTHOR_401);
    }

    

    onAuthorizationAdmin(){
        this.AuthAdmin = "Basic YWRtaW46cXdlcnR5"
    }

    offAuthorizationAdmin(){
        this.AuthAdmin = 'hygf gj'
    }
}