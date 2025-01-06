import {Router} from 'express';
import { blogValidator } from './middleware/blog.validator';
import { authAdminByPassword } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { blogControllers, postControllers } from '../../../instances';
import { postForBlogValidator } from '../../posts/api/middleware/post.validator';

export const blogsRouter = Router({});

blogsRouter.get('/', blogControllers.get.bind(blogControllers));
blogsRouter.get('/:id', blogControllers.getById.bind(blogControllers));
blogsRouter.delete('/:id', authAdminByPassword, blogControllers.deleteById.bind(blogControllers));
blogsRouter.put('/:id', authAdminByPassword, blogValidator, checkInputValidation, blogControllers.put.bind(blogControllers));
blogsRouter.post('/', authAdminByPassword, blogValidator, checkInputValidation, blogControllers.post.bind(blogControllers));

blogsRouter.get('/:id/posts', postControllers.getByBlog.bind(blogControllers));
blogsRouter.post('/:id/posts', authAdminByPassword, postForBlogValidator, checkInputValidation, postControllers.postByBlog.bind(blogControllers));
  