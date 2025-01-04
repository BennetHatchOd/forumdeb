import {Router} from 'express';
import { blogValidator } from './middleware/blog.validator';
import { authAdminByPassword } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { blogControllers, postControllers } from '../../../instances';
import { postForBlogValidator } from '../../posts/api/middleware/post.validator';

export const blogsRouter = Router({});

blogsRouter.get('/', blogControllers.get);
blogsRouter.get('/:id', blogControllers.getById);
blogsRouter.delete('/:id', authAdminByPassword, blogControllers.deleteById);
blogsRouter.put('/:id', authAdminByPassword, blogValidator, checkInputValidation, blogControllers.put);
blogsRouter.post('/', authAdminByPassword, blogValidator, checkInputValidation, blogControllers.post);

blogsRouter.get('/:id/posts', postControllers.getByBlog);
blogsRouter.post('/:id/posts', authAdminByPassword, postForBlogValidator, checkInputValidation, postControllers.postByBlog);
  