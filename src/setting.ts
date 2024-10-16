import dotenv from 'dotenv'

dotenv.config()

export const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const DB_NAME = 'forumDebol'
export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts' 
export const USER_COLLECTION_NAME = 'users' 
export const USER_UNCONFIRMED_COLLECTION_NAME = 'unconfirmedUsers' 
export const COMMENT_COLLECTION_NAME = 'comments' 

export const PORT = process.env.PORT || 3014
export const SECRET_KEY = process.env.SECRET_KEY || '114' 
export const PASSCODE_ADMIN = process.env.PASSCODE_ADMIN || 'admin:qwerty' 
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL  

export const TIME_LIFE_TOKEN = '1h'

export const HTTP_STATUSES = {
    OK_200:             200,
    CREATED_201:        201,
    NO_CONTENT_204:     204,
    BAD_REQUEST_400:    400,
    NO_AUTHOR_401:      401,
    FORBIDDEN:          403,
    NOT_FOUND_404:      404,
    ERROR_500:          500 
}
  
export const URL_PATH = {
    base:       '/',
    blogs:      '/blogs',
    posts:      '/posts',
    users:      '/users',
    auth:       '/auth',
    comments:   '/comments'
}