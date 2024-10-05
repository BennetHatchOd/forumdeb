import express from 'express';
import cors from 'cors'
import { blogsRouter } from './variety/blogs/blogsRouter';
import { usersRouter } from './variety/users/usersRouter';
import { postsRouter } from './variety/posts/postsRouter';
import { URL_PATH } from './setting';
import { authRouter } from './variety/auth/authRouter';
import { commentsRouter } from './variety/comments/commentsRouter';
import { deleteAllController } from './deleteAllController';




export const app = express();

app.use(cors());


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);


app.get(URL_PATH.base, (req,res) => {   
    res.status(200).json({version: '2.0 '});
    
}) 

app.use(URL_PATH.blogs, blogsRouter)
app.use(URL_PATH.posts, postsRouter)
app.use(URL_PATH.users, usersRouter)
app.use(URL_PATH.auth,  authRouter)
app.use(URL_PATH.comments, commentsRouter)

app.delete('/testing/all-data', deleteAllController);



