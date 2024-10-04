import {Router} from 'express';
import { authorizatorAdmin, authorizatorUser } from '../../midlleware/authorization';
import { checkInputValidation } from '../../midlleware/checkInputValidators';
import { postValidator } from './middleware/postValidator';
import { postControllers } from './postControllers';
import { commentValidator } from '../comments/middleware/commentValidator';
import { commentControllers } from '../comments/commentControllers';

export const postsRouter = Router({});

postsRouter.get('/',  postControllers.getPost);
postsRouter.get('/:id', postControllers.getPostById);
postsRouter.delete('/:id', authorizatorAdmin,  postControllers.deletePostById);
postsRouter.put('/:id', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.putPost);
postsRouter.post('/', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.postPost);

postsRouter.get('/:id/comments', commentControllers.getCommentToPost);
postsRouter.post('/:id/comments', authorizatorUser,  commentValidator, checkInputValidation, commentControllers.postCommentToPost);
