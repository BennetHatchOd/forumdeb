import {Router} from 'express';
import { getPostController } from './controllers/getPostController';
import { getPostByIdController } from './controllers/getPostByIdController';
import { deletePostByIdController } from './controllers/deletePostByIdController';
import { putPostController } from './controllers/putPostController';
import { postPostController } from './controllers/postPostController';
import { authorizator } from '../../midlleware/authorizator';
import { checkInputValidation } from '../../midlleware/checkInputValidators';
import { postValidator } from './middleware/postValidator';
import { paginatorValidator } from '../../midlleware/paginatorValidator';

export const postsRouter = Router({});

postsRouter.get('/', paginatorValidator, getPostController);
postsRouter.get('/:id', getPostByIdController);
postsRouter.delete('/:id', authorizator,  deletePostByIdController);
postsRouter.put('/:id', authorizator,  postValidator, checkInputValidation, putPostController);
postsRouter.post('/', authorizator,  postValidator, checkInputValidation, postPostController);