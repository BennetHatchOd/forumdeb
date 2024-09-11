import dotenv from 'dotenv'

dotenv.config()

export const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const DB_NAME = 'forumDebol'
export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts' 

export const SETTING = {
    PORT: process.env.PORT || 3014
}

export const HTTP_STATUSES = {
    OK_200:             200,
    CREATED_201:        201,
    NO_CONTENT_204:     204,
    BAD_REQUEST_400:    400,
    NO_AUTHOR_401:      401,
    NOT_FOUND_404:      404,
    ERROR_500:          500 
}
  
export const URL_PATH = {
    base:       '/',
    blogs:      '/blogs',
    posts:      '/posts',
}