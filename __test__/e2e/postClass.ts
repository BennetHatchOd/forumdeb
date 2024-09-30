import {APIErrorResult, PostInputModel, PostViewModel, FieldError, QueryModel} from '../../src/types'
import {HTTP_STATUSES, URL_PATH} from '../../src/setting'
import { app } from "../../src/app";
import request from "supertest";
import { SortDirection } from 'mongodb';
import { BlogEndPoint } from './blogClass';

type InputQuery = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number}

export class PostEndPoint{
    
    private itemView: Array<PostViewModel> = []
    private itemCorrect: Array<PostInputModel> = []
    private itemIncorrect!: Array<PostInputModel>
    private itemErrors: Array<APIErrorResult>
    private errorTitle: FieldError
    private errorShortDescription: FieldError
    private errorContent: FieldError
    private errorBlogId: FieldError
    private Auth!: string
    private blogs = new BlogEndPoint()

    static async getInstance():Promise<PostEndPoint>{
        const instance = new PostEndPoint()
        await instance.initialize()
        return instance
    }

    constructor(){
        this.errorTitle = {
            "message": expect.any(String),
            "field": "title"
        }
        this.errorShortDescription = {
            "message": expect.any(String),
            "field": "shortDescription"
        }    
        this.errorContent = {
            "message": expect.any(String),
            "field": "content"
        }
        this.errorBlogId = {
            "message": expect.any(String),
            "field": "blogId"
        }   

        this.itemErrors = [{
            "errorsMessages": [this.errorTitle, this.errorShortDescription ]
        },
        { "errorsMessages": [this.errorBlogId]
        },
        { "errorsMessages": [this.errorContent]
        },
        { "errorsMessages": [this.errorTitle, this.errorShortDescription, this.errorBlogId ]
        }]

        this.onAuthorization()
    }

    private async initialize() {

        await this.blogs.createItem(0)
        await this.blogs.createItem(1)
        await this.blogs.createItem(3)

        for(let i = 0; i < 10; i++){
            this.itemCorrect.push({
                title:              'title' + i,                   
                shortDescription:   'this is post for ' + this.blogs.getIdItem( i % 2),            
                content:            'https://one.two.com',
                blogId:             this.getBlogId(i)         
            })
        }

        this.itemIncorrect = [
        {   title: "length3112345678921645121542354",
            shortDescription: "",
            content: ";l;ljl;k jlkjlkjlk",
            blogId: this.blogs.getIdItem( 0)
            },
        {   title: "length16123456789",
            shortDescription: "0123",
            content: "ttps://google123456789012345678901234567890.com",
            blogId: 'ertt'
            },
        {   title: "length16123456789",
            shortDescription: "0123",
            content: "ttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhttps://google123456789012345678901234567890.comlkjhhjj",
            blogId: this.blogs.getIdItem(1)
            },
        {   title: "",
            shortDescription: "0123",
            content: "",
            blogId: 'ertt'
            }]
    }

    async createItem(numberInCorrect: number = 0, blogId?: string, urlPostBlog?: string, title?: string, shortDescription?: string, content?: string ){
        const inTitle = title ? {title: title} : {}
        const inShortDescription = shortDescription ? {shortDescription: shortDescription} : {}
        const  inContent = content ? {content: content} : {}
        const  inBlogId = blogId ? {blogId: blogId} : {}
        const url = urlPostBlog ? urlPostBlog : URL_PATH.posts

        const newItem = {...this.itemCorrect[numberInCorrect], ...inTitle, ...inShortDescription, ...inContent, ...inBlogId}
        let createdResponse = await 
                request(app)
                .post(url)
                .set("Authorization", this.Auth)
                .send(newItem)
                .expect(HTTP_STATUSES.CREATED_201);

        let createdItem: PostViewModel = createdResponse.body;
        this.itemView.push({...createdItem})

        expect(createdItem).toEqual({
            id: expect.any(String),
            title: newItem.title,
            shortDescription: newItem.shortDescription,
            content: newItem.content,
            createdAt: expect.any(String),
            blogId: this.itemCorrect[numberInCorrect].blogId,
            blogName: this.getBlogName(numberInCorrect)
        })
    }

    async createItemNoAuth(i: number = 0){
        this.offAuthorization()
        await request(app)
            .post(URL_PATH.posts)
            .set("Authorization", this.Auth)
            .send(this.itemCorrect[i])
            .expect(HTTP_STATUSES.NO_AUTHOR_401);
        this.onAuthorization()

    }
    async createBADitem(i:number = 0){
        let createdResponse = await 
        request(app)
        .post(URL_PATH.posts)
        .set("Authorization", this.Auth)
        .send(this.itemIncorrect[i])
        .expect(HTTP_STATUSES.BAD_REQUEST_400);

        let notCreatedError = createdResponse.body;

        expect(notCreatedError).toEqual(this.itemErrors[i]        )
    }

    async getItemById(numberInArray: number = 0){
        let foundResponse = await 
                request(app)
                .get(`${URL_PATH.posts}/${this.itemView[numberInArray].id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.OK_200);

        let foundItem = foundResponse.body;
        
        expect(foundItem).toEqual(this.itemView[numberInArray])
    }

    async getItemByBadId(id: string){
        await request(app)
                .get(`${URL_PATH.posts}/${id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteIDitem(numberInArray: number = 0){
        await request(app)
                .delete(`${URL_PATH.posts}/${this.itemView[numberInArray].id}`)
                .set("Authorization", this.Auth)
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        this.itemView.splice(numberInArray, 1)    
    }

    async deleteNoItemOrBadAuth(notAuth: boolean = true, id: string =this.itemView[0].id ){
        // true - not authorization
        let status = HTTP_STATUSES.NOT_FOUND_404
        
        if(notAuth){
            status = HTTP_STATUSES.NO_AUTHOR_401
            this.offAuthorization()
        }
        await request(app)
                .delete(`${URL_PATH.posts}/${id}`)
                .set("Authorization", this.Auth)
                .expect(status);
        this.onAuthorization()
    }
    
    async getItems(inputQuery: InputQuery = {})
    {
        let foundResponse = await request(app)
                .get(URL_PATH.posts)
                .set("Authorization", this.Auth)
                .query(inputQuery)
                .expect(HTTP_STATUSES.OK_200);

        let foundItems = foundResponse.body

        let outArray = this.itemView

        expect(foundItems).toEqual(this.setPaginator(inputQuery, outArray))

    }

    async editItem(inView: number = 0, inCorrect = 3, title?: string, shortDescription?: string, content?: string ){
        let inTitle = title ? {title: title} : {}
        let inShortDescription = shortDescription ? {shortDescription: shortDescription} : {}
        let  inContent = content ? {content: content} : {}
        const editData = {...this.itemCorrect[inCorrect], ...inTitle, ...inShortDescription, ...inContent}
        
        await request(app)
                .put(`${URL_PATH.posts}/${this.itemView[inView].id}`)
                .set("Authorization", this.Auth)
                .send(editData)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

        this.itemView[inView] = {...this.itemView[inView], ...editData, blogName:this.getBlogName(inCorrect)}
    }

    async editItemByBadId(id: string ){
        
        await request(app)
                .put(`${URL_PATH.posts}/${id}`)
                .set("Authorization", this.Auth)
                .send(this.itemCorrect[0])
                .expect(HTTP_STATUSES.NOT_FOUND_404);

    }

    async editItemNoAuth(i: number = 0){
        this.offAuthorization()

        await request(app)
                .put(`${URL_PATH.posts}/${this.itemView[i].id}`)
                .set("Authorization", this.Auth)
                .send(this.itemCorrect[0])
                .expect(HTTP_STATUSES.NO_AUTHOR_401);
        this.onAuthorization()
    }

    setPaginator(inputQuery: InputQuery, inArray: Array<PostViewModel>){
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

        type ItemField = keyof PostViewModel    
        const fieldSort: ItemField = (inputQuery.sortBy ? inputQuery.sortBy : 'createdAt') as ItemField
        const directSort = inputQuery.sortDirection == 'asc' ? 1 : -1   
        
        inArray.sort((a,b) => {
            console.log(fieldSort, a[fieldSort])
            return a[fieldSort].localeCompare(b[fieldSort]) * directSort} ) 
       
        let outArray: Array<PostViewModel> = inArray.slice(pageSize * (page - 1), pageSize * page)
        
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
        return this.itemView.length
    }

    showArrayItems(){
        console.log(this.itemView)
    }

    getBlogId(i: number){
        
        return this.blogs.getIdItem( i % 3)
    }

    getBlogName(i: number){
        return this.blogs.getNameItem( i % 3)
    }
}