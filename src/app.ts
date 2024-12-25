import express from 'express';
import cors from 'cors'
import { blogsRouter } from './variety/blogs/api/blogsRouter';
import { usersRouter } from './variety/users/api/users.router';
import { postsRouter } from './variety/posts/postsRouter';
import { URL_PATH } from './setting'
import cookieParser from 'cookie-parser'
import { authRouter } from './variety/auth/authRouter';
import { commentsRouter } from './variety/comments/api/commentsRouter';
import { deleteAllController } from './deleteAllController';
import { deviceRouter } from './variety/devices/api/deviceRouter';




export const app = express();

app.use(cors())
app.use(cookieParser())
app.set('trust proxy', true)

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);


app.get(URL_PATH.base, (req,res) => {   
    res.status(200).json({version: '1.0 '});
    
}) 

app.use(URL_PATH.blogs, blogsRouter)
app.use(URL_PATH.posts, postsRouter)
app.use(URL_PATH.users, usersRouter)
app.use(URL_PATH.auth,  authRouter)
app.use(URL_PATH.devices,  deviceRouter)
app.use(URL_PATH.comments, commentsRouter)

app.delete('/testing/all-data', deleteAllController);



