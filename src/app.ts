import express from 'express';
import cors from 'cors'
import { blogsRouter } from './variety/blogs/blogsRouter';
import { usersRouter } from './variety/users/usersRouter';
import { postsRouter } from './variety/posts/postsRouter';
import { deleteAllController } from './Controllers/deleteAllController';
import { URL_PATH } from './setting';
import { authLoginController } from './Controllers/authLoginController';




export const app = express();

app.use(cors());


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);


app.get(URL_PATH.base, (req,res) => {   
    res.status(200).json({version: '1.2 '});
    
}) 

app.use(URL_PATH.blogs, blogsRouter);
app.use(URL_PATH.posts, postsRouter);
app.use(URL_PATH.users, usersRouter);

app.post(URL_PATH.auth, authLoginController)
app.delete('/testing/all-data', deleteAllController);



