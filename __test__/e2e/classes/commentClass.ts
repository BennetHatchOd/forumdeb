import { SortDirection } from 'mongodb';
import { BlogEndPoint } from './blogClass';
import { UserInputModel, UserViewModel } from '../../../src/variety/users/types';
import { APIErrorResult, FieldError } from '../../../src/types/types';

type InputQuery = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number}

export class UserEndPoint{
    private itemView: Array<UserViewModel> = []
    private itemCorrect: Array<UserInputModel> = []
    private itemIncorrect!: Array<UserInputModel>
    private itemErrors: Array<APIErrorResult>
    private errorTitle: FieldError
    private errorShortDescription: FieldError
    private errorContent: FieldError
    private errorBlogId: FieldError
    private Auth!: string
    private blogs!: BlogEndPoint

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

    async initialize(linkedBlog: BlogEndPoint) {

        this.blogs = linkedBlog
        await this.blogs.createItem(0)
        await this.blogs.createItem(1)
        await this.blogs.createItem(2)

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


}