import {Router} from 'express';
import { getBlogController } from './controllers/getBlogController';
import { getBlogByIdController } from './controllers/getBlogByIdController';
import { deleteBlogByIdController } from './controllers/deleteBlogByIdController';
import { putBlogController } from './controllers/putBlogController';
import { postBlogController } from './controllers/postBlogController';
import { blogValidator } from './middleware/blogValidator';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import {postPostToBlogController} from './controllers/postPostToBlogController';
import { getPostToBlogController } from './controllers/getPostToBlogController';
import { paginatorValidator } from '../../midlleware/paginatorValidator';

export const blogsRouter = Router({});

blogsRouter.get('/', paginatorValidator, getBlogController);
blogsRouter.get('/:id', getBlogByIdController);
blogsRouter.delete('/:id', authorizator, deleteBlogByIdController);
blogsRouter.put('/:id', authorizator, blogValidator, checkInputValidation, putBlogController);
blogsRouter.post('/', authorizator, blogValidator, checkInputValidation, postBlogController);

blogsRouter.get('/:id/post', paginatorValidator, getPostToBlogController);
blogsRouter.post('/:id/post', authorizator, postPostToBlogController);
  