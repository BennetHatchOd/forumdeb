import express from 'express';
import cors from 'cors'
import { blogsRouter } from './variety/blogs/blogRouter';
import { postsRouter } from './variety/posts/postRouter';
import { deleteAllController } from './testingEP/deleteAllController';
import { URL_PATH } from './setting';
import { testGet } from './testingEP/testGet';




export const app = express();

app.use(cors());


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);


app.get(URL_PATH.base, (req,res) => {   
    res.status(200).json({version: '2.2 '});
    
})

app.use(URL_PATH.blogs, blogsRouter);
app.use(URL_PATH.posts, postsRouter);


app.delete('/testing/all-data', deleteAllController);
app.get('/test', testGet)



