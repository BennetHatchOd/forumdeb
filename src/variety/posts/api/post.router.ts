import {Router} from 'express';
import { postValidator } from './middleware/post.validator';
import { postControllers } from './post.controller';

export const postsRouter = Router({});

postsRouter.get('/',  postControllers.getPost);
postsRouter.get('/:id', postControllers.getPostById);
postsRouter.delete('/:id', authorizatorAdmin,  postControllers.deletePostById);
postsRouter.put('/:id', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.putPost);
postsRouter.post('/', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.postPost);

postsRouter.get('/:id/comments', commentControllers.getCommentToPost);
postsRouter.post('/:id/comments', authorizatorUser,  commentValidator, checkInputValidation, commentControllers.postCommentToPost);
