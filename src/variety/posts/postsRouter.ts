import {Router} from 'express';
import { authorizator } from '../../midlleware/authorizator';
import { checkInputValidation } from '../../midlleware/checkInputValidators';
import { postValidator } from './middleware/postValidator';
import { paginatorValidator } from '../../midlleware/paginatorValidator';
import { postControllers } from './controllers/postControllers';

export const postsRouter = Router({});

postsRouter.get('/', paginatorValidator, checkInputValidation, postControllers.getPost);
postsRouter.get('/:id', postControllers.getPostById);
postsRouter.delete('/:id', authorizator,  postControllers.deletePostById);
postsRouter.put('/:id', authorizator,  postValidator, checkInputValidation, postControllers.putPost);
postsRouter.post('/', authorizator,  postValidator, checkInputValidation, postControllers.postPost);