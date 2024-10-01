import {APIErrorResult, BlogInputModel, BlogViewModel, FieldError, PostInputModel, PostViewModel, QueryModel} from '../../src/types'
import {HTTP_STATUSES, URL_PATH} from '../../src/setting'
import { app } from "../../src/app";
import request from "supertest";
import { SortDirection } from 'mongodb';
import { PostEndPoint } from './postClass';

type InputQuery = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
    searchNameTerm?: string }

export class BlogEndPoint{
    
    private blogView: Array<BlogViewModel> = []

    private blogCorrect: Array<BlogInputModel> = []
    private blogIncorrect: Array<BlogInputModel>
    private blogErrors: Array<APIErrorResult>
    private errorName: FieldError
    private errorDescription: FieldError
    private errorWeb: FieldError
    private Auth!: string
    private posts!: PostEndPoint


    constructor(){

        for(let i = 0; i < 10; i++){
            this.blogCorrect[i]= {
                name: 'name' + i,                   
                description: 'string' + i,            
                websiteUrl:	'https://one.two.com'         
            }
        }

        this.blogIncorrect = [
        {    name: "length16123456789",
            description: "0123",
            websiteUrl: "ttps://google123456789012345678901234567890.com"
            },
        {   name: '',                   
            description: 'lenght501012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',            
            websiteUrl:	'http://one.two.com'         
            },
        {   name: "",
            description: "0123",
            websiteUrl: "https://length101googlecom.vfkgjfndjfnvg.gmnfkdlkm.fmnvkkmkm.lekmnjnnnnnnlek.lekmkmkmemkmekmekmek.ekm"
        }]

        this.errorName = {
            "message": expect.any(String),
            "field": "name"
        }
        this.errorDescription = {
            "message": expect.any(String),
            "field": "description"
        }    
        this.errorWeb = {
            "message": expect.any(String),
            "field": "websiteUrl"
        }
        this.blogErrors = [{
            "errorsMessages": [this.errorName, this.errorWeb ]
        },
        { "errorsMessages": [this.errorName, this.errorDescription, this.errorWeb ]
        },
        { "errorsMessages": [this.errorName, this.errorWeb ]
        }]

        this.onAuthorization()
    }
    async initialize(linkedBlog: PostEndPoint) {

        this.posts = linkedBlog
    }

    async createItem(i: number = 0, name?: string, description?: string, websiteUrl?: string ){
        let inName = name ? {name: name} : {}
        let inDescription = description ? {description: description} : {}
        let  inWebsiteUrl = websiteUrl ? {websiteUrl: websiteUrl} : {}
        const createItem = {...this.blogCorrect[i], ...inName, ...inDescription, ...inWebsiteUrl}
        let createdResponse = await 
                request(app)
                .post(URL_PATH.blogs)
                .set("Authorization", this.Auth)
                .send(createItem)
                .expect(HTTP_STATUSES.CREATED_201);

        let createdItem = createdResponse.body;
        this.blogView.push({...createdItem})

        expect(createdItem).toEqual({
            id: expect.any(String),
            name: createItem.name,
            description: createItem.description,
            websiteUrl: createItem.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        })
    }
    async createItemNoAuth(i: number = 0){
        this.offAuthorization()
        await request(app)
            .post(URL_PATH.blogs)
            .set("Authorization", this.Auth)
            .send(this.blogCorrect[i])
            .expect(HTTP_STATUSES.NO_AUTHOR_401);
        this.onAuthorization()

    }
    async createBADblog(i:number = 0){
        let createdResponse = await 
        request(app)
        .post(URL_PATH.blogs)
        .set("Authorization", this.Auth)
        .send(this.blogIncorrect[i])
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
        
        expect(foundItem).toEqual(this.blogView[numberInArray])
    }
    async getBlogByBadId(id: string){
        let foundResponse = await 
                request(app)
                .get(`${URL_PATH.blogs}/${id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
    }


    async deleteIDblog(numberInArray: number = 0){
        await request(app)
                .delete(`${URL_PATH.blogs}/${this.blogView[numberInArray].id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        this.blogView.splice(numberInArray, 1)
        
    }
    async deleteNoBlog(notAuth: boolean = true, id: string =this.blogView[0].id ){
        // true - not authorization
        let status = HTTP_STATUSES.NOT_FOUND_404
        
        if(notAuth){
            status = HTTP_STATUSES.NO_AUTHOR_401
            this.offAuthorization()
        }
        await request(app)
                .delete(`${URL_PATH.blogs}/${id}`)
                .set("Authorization", this.Auth)
                .expect(status);
        this.onAuthorization()
    }


    async getBlogs(inputQuery: InputQuery = {})
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


    async editItem(inView: number = 0, inCorrect = 3, name?: string, description?: string, websiteUrl?: string ){
        let inName = name ? {name: name} : {}
        let inDescription = description ? {description: description} : {}
        let  inWebsiteUrl = websiteUrl ? {websiteUrl: websiteUrl} : {}
        const editData = {...this.blogCorrect[inCorrect], ...inName, ...inDescription, ...inWebsiteUrl}

        await request(app)
                .put(`${URL_PATH.blogs}/${this.blogView[inView].id}`)
                .set("Authorization", this.Auth)
                .send(editData)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

        this.blogView[inView] = {...this.blogView[inView], ...editData}

    }

    async editItemByBadId(id: string ){
    
        await request(app)
                .put(`${URL_PATH.blogs}/${id}`)
                .set("Authorization", this.Auth)
                .send(this.blogCorrect[0])
                .expect(HTTP_STATUSES.NOT_FOUND_404);

    }

    async editItemNoAuth(i: number = 0 ){
        this.offAuthorization()

        await request(app)
                .put(`${URL_PATH.blogs}/${this.blogView[i].id}`)
                .set("Authorization", this.Auth)
                .send(this.blogCorrect[0])
                .expect(HTTP_STATUSES.NO_AUTHOR_401);
        this.onAuthorization()
    }


    async createPost(numberBlogInView: number, titleIn?: string, shortDescriptionIn?: string, contentIn?: string ){
    
        const newItem: PostInputModel = {
                title: titleIn ? titleIn : 'title',                   
                shortDescription: shortDescriptionIn ? shortDescriptionIn : 'this is post for ' + this.blogView[numberBlogInView].id,            
                content: contentIn ? contentIn : 'this is text for content',
                blogId: this.blogView[numberBlogInView].id
            }
        
        let createdResponse = await 
                request(app)
                .post(`${URL_PATH.blogs}/${this.blogView[numberBlogInView].id}/posts`)
                .set("Authorization", this.Auth)
                .send(newItem)
                .expect(HTTP_STATUSES.CREATED_201);

        let createdItem: PostViewModel = createdResponse.body;
        this.posts.setItemView(createdItem)

        expect(createdItem).toEqual({
            id: expect.any(String),
            title: newItem.title,
            shortDescription: newItem.shortDescription,
            content: newItem.content,
            createdAt: expect.any(String),
            blogId: this.blogView[numberBlogInView].id,
            blogName: this.blogView[numberBlogInView].name
        })
    }
    async createBadPost(authOrBadOrId: string, data = 'y7u77uhttfrf6'){
        let status = 0
        let url = `${URL_PATH.blogs}/${this.blogView[0].id}/posts`
        let newItem: PostInputModel = {
                    title: 'title',                   
                    shortDescription: 'this is post for ' + this.blogView[0].id,            
                    content: 'this is text for content',
                    blogId: this.blogView[0].id}

        switch(authOrBadOrId){
            case 'auth':
                this.offAuthorization()
                status = HTTP_STATUSES.NO_AUTHOR_401
                break
            case 'bad':
                newItem.title = ''
                status = HTTP_STATUSES.BAD_REQUEST_400
                break
            case 'id':
                url = `${URL_PATH.blogs}/${data}/posts`
                status = HTTP_STATUSES.NOT_FOUND_404
                }

        
        await request(app)
                .post(url)
                .set("Authorization", this.Auth)
                .send(newItem)
                .expect(status);

        this.onAuthorization()     
        
    }    

    // async createBadPost(numberBlogInView: number, numberPostInCorrect: number){
    // }

    // async createPostBadId(numberBlogInView: number, numberPostInCorrect: number ){
    // }

    // async createBadPostWithoutAuth(numberBlogInView: number, numberPostInCorrect: number){
    // }


    setPaginator(inputQuery: InputQuery, inArray: Array<BlogViewModel>){
        let {pageSize = 10, pageNumber} = inputQuery
        const page = pageNumber ? pageNumber : 1
        
        if(inArray.length == 0)
            return{
                pagesCount: 0,
                page: 0,
                pageSize: pageSize,
                totalCount: 0,
                items: []
            }

        type BlogField = keyof BlogViewModel    
        const fieldSort: BlogField = (inputQuery.sortBy ? inputQuery.sortBy : 'createdAt') as BlogField
        const directSort = inputQuery.sortDirection == 'asc' ? 1 : -1   
        
        if(fieldSort != 'isMembership')
            inArray.sort((a,b) => a[fieldSort].localeCompare(b[fieldSort]) * directSort ) 
        else
        inArray.sort((a,b) => {
                            if(a[fieldSort] && !b[fieldSort]) 
                                return directSort
                            if(!a[fieldSort] && b[fieldSort]) 
                                return -directSort
                            return 0}) 
        
        let outArray: Array<BlogViewModel> = inArray.slice(pageSize * (page - 1), pageSize * page)
        
        return {
            pagesCount: Math.ceil(outArray.length / pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: outArray.length,
            items: outArray
        }
    }

    onAuthorization(){
        this.Auth = "Basic YWRtaW46cXdlcnR5"
    }

    offAuthorization(){
        this.Auth = 'hygf gj'
    }

    getNumberItems(){
        return this.blogView.length
    }

    showArrayItems(){
        console.log(this.blogView)
    }

    getIdItem(i: number){
        return this.blogView[i].id 
    }

    getNameItem(i: number){
        return this.blogView[i].name 
    }

}