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

export const blogsRouter = Router({});

blogsRouter.get('/', getBlogController);
blogsRouter.get('/:id', getBlogByIdController);
blogsRouter.delete('/:id', authorizator, deleteBlogByIdController);
blogsRouter.put('/:id', authorizator, blogValidator, checkInputValidation, putBlogController);
blogsRouter.post('/', authorizator, blogValidator, checkInputValidation, postBlogController);

blogsRouter.get('/:id/post', getPostToBlogController);
blogsRouter.post('/:id/post', postPostToBlogController);
  