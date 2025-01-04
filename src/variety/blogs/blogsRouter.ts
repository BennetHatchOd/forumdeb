import {Router} from 'express';
import { blogControllers } from './api/blog.controller';
import { blogValidator } from './api/middleware/blog.validator';
import { authAdminByPassword } from '../../midlleware/authorization';
import {checkInputValidation} from '../../midlleware/check.input.validators'
import { postForBlogValidator } from '../posts/middleware/postValidator';
import { URL_PATH } from '../../setting';

export const blogsRouter = Router({});

blogsRouter.get('/',                           blogControllers.getBlog);
blogsRouter.get('/:id',                                                                 blogControllers.getBlogById);
blogsRouter.delete('/:id',  authAdminByPassword,                                               blogControllers.deleteBlogById);
blogsRouter.put('/:id',     authAdminByPassword, blogValidator, checkInputValidation,          blogControllers.putBlog);
blogsRouter.post('/',       authAdminByPassword, blogValidator, checkInputValidation,          blogControllers.postBlog);

blogsRouter.get('/:id/posts',                                                           blogControllers.getPostByBlog);
blogsRouter.post('/:id/posts', authAdminByPassword, postForBlogValidator, checkInputValidation, blogControllers.postPostByBlog);
  