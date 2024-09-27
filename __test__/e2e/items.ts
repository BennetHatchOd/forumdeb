import {APIErrorResult, BlogInputModel, BlogViewModel, FieldError, QueryModel} from '../../src/types'
import {HTTP_STATUSES, URL_PATH} from '../../src/setting'
import { app } from "../../src/app";
import request from "supertest";
import { SortDirection } from 'mongodb';

export class BlogEndPoint{

    private blogCorrect: Array<BlogInputModel> = []
    private blogView: Array<BlogViewModel> = []
    private blogIncorrect: Array<BlogInputModel>
    private blogErrors: Array<APIErrorResult>
    private errorName: FieldError
    private errorDescription: FieldError
    private errorWeb: FieldError
    private Auth: string
    AuthFlag: boolean


    constructor(){

        for(let i = 0; i < 10; i++){
            this.blogCorrect[i]= {
                name: 'name' + i,                   
                description: 'string',            
                websiteUrl:	'https://one.two.com'         
            }
        }

        this.blogIncorrect = [{
            name: "length16123456789",
            description: "0123",
            websiteUrl: "ttps://google123456789012345678901234567890.com"
            },
        {name: 'badBlog',                   
            description: '',            
            websiteUrl:	'http://one.two.com'         
            },
        {name: "",
            description: "0123",
            websiteUrl: "https://length101googlecom.vfkgjfndjfnvg.gmnfkdlkm.fmnvkkmkm.lekmnjnnnnnnlek.lekmkmkmemkmekmekmek.ekm"
        }]

        this.errorName = {
            "message": expect.any(String),
            "field": "name"
        }
        this.errorDescription = {
            "message": expect.any(String),
            "field": "name"
        }    
        this.errorWeb = {
            "message": expect.any(String),
            "field": "name"
        }
        this.blogErrors = [{
            "errorsMessages": [this.errorName, this.errorWeb ]
        },
        { "errorsMessages": [this.errorDescription, this.errorWeb ]
        },
        { "errorsMessages": [this.errorName, this.errorWeb ]
        }]

        this.onAuthorization()
    }

    async createItem(i: number = 0){
        let createdResponse = await 
                request(app)
                .post(URL_PATH.blogs)
                .set("Authorization", this.Auth)
                .send(this.blogCorrect[i])
                .expect(HTTP_STATUSES.CREATED_201);

        let createdItem = createdResponse.body;
        this.blogView.push({...createdItem})

        expect(createdItem).toEqual({
            id: expect.any(String),
            name: this.blogCorrect[i].name,
            description: this.blogCorrect[i].description,
            websiteUrl: this.blogCorrect[i].websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        })

    }
    async createItemNoAuth(i: number = 0){
        this.offAuthorization
        await request(app)
            .post(URL_PATH.blogs)
            .set("Authorization", this.Auth)
            .send(this.blogCorrect[i])
            .expect(HTTP_STATUSES.NO_AUTHOR_401);
        this.onAuthorization

    }
    async createBADblog(i:number = 0){
        let createdResponse = await 
        request(app)
        .post(URL_PATH.blogs)
        .set("Authorization", this.Auth)
        .send(this.blogCorrect[i])
        .expect(HTTP_STATUSES.BAD_REQUEST_400);

        let notCreatedError = createdResponse.body;

        expect(notCreatedError).toEqual(this.blogErrors[i]        )
    }

    async getIDblog(numberInArray: number = 0){
        let foundResponse = await 
                request(app)
                .get(`${URL_PATH.blogs}/${this.blogView[numberInArray].id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.OK_200);

        let foundItem = foundResponse.body;
        this.blogView.push({...foundItem})

        expect(foundItem).toEqual(this.blogView[numberInArray])
    }
 
    async getBlogs(inputQuery: {
                sortBy?: string,
                sortDirection?: SortDirection,
                pageNumber?: number,
                pageSize?: number,
                searchNameTerm?: string } = {})
    {
        let foundResponse = await request(app)
                .get(URL_PATH.blogs)
                .set("Authorization", this.Auth)
                .query(inputQuery)
                .expect(HTTP_STATUSES.OK_200);

        let foundItems = foundResponse.body

        let outArray = this.blogView
        if(inputQuery?.searchNameTerm){
            const regExp = new RegExp(inputQuery.searchNameTerm, 'i')
            outArray = this.blogView.filter(s => s.name.search(regExp))
        }

        expect(foundItems).toEqual(this.setPaginator(inputQuery, outArray))

    }

    setPaginator(inputQuery, outArray){
        let {pageSize, pageNumber} = inputQuery
        return {
            pagesCount: Math.ceil(outArray.length / pageSize),
            page: pageNumber ? pageNumber : 1,
            pageSize: pageSize ? pageSize : 10,
            totalCount: outArray.length,
            items: outArray
        }
    }

    onAuthorization(){
        this.Auth = "Basic YWRtaW46cXdlcnR5"
        this.AuthFlag = true
    }

    offAuthorization(){
        this.Auth = 'hygf gj'
        this.AuthFlag = false
    }
}