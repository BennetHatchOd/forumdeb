import dotenv from 'dotenv'

dotenv.config()

export const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const DB_NAME = 'forumDebol'
export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts' 
export const USER_COLLECTION_NAME = 'users' 
export const COMMENT_COLLECTION_NAME = 'comments' 
export const TOKEN_COLLECTION_NAME = 'tokens'
export const REQUEST_COLLECTION_NAME = 'requests'
export const SESSION_COLLECTION_NAME = 'sessions'
export const USER_UNCONFIRMED_COLLECTION_NAME = 'unconfirmedusers' 

export const PORT = process.env.PORT || 3014
export const SECRET_KEY = process.env.SECRET_KEY || '114' 
export const PASSCODE_ADMIN = process.env.PASSCODE_ADMIN || 'admin:qwerty' 
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL  

export const TIME_LIFE_ACCESS_TOKEN = 10
export const TIME_LIFE_REFRESH_TOKEN = 20

export const TIME_RATE_LIMITED = 10
export const COUNT_RATE_LIMITED = 5

export const LENGTH_VERSION_ID = 7

export const HTTP_STATUSES = {
    OK_200:                 200,
    CREATED_201:            201,
    NO_CONTENT_204:         204,
    BAD_REQUEST_400:        400,
    NO_AUTHOR_401:          401,
    FORBIDDEN:              403,
    NOT_FOUND_404:          404,
    ERROR_500:              500,
    TOO_MANY_REQUESTS_429:  429
}
  
export const URL_PATH = {
    base:       '/',
    blogs:      '/blogs',
    posts:      '/posts',
    users:      '/users',
    auth:       '/auth',
    devices:    '/security/devices',
    comments:   '/comments'
}
export const AUTH_PATH = {
    login:           '/login',
    confirm:         '/registration-confirmation',
    registration:    '/registration',
    resent:          '/registration-email-resending',
    refresh:         '/refresh-token',
    logout:          '/logout',
    me:              '/me'
}