import {Router} from 'express';
import { blogControllers } from './blog.controller';
import { blogValidator } from './middleware/blog.validator';
import { authorizatorAdmin } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { URL_PATH } from '../../../setting';

export const blogsRouter = Router({});

blogsRouter.get('/',                           blogControllers.getBlog);
blogsRouter.get('/:id',                                                                 blogControllers.getBlogById);
blogsRouter.delete('/:id',  authorizatorAdmin,                                               blogControllers.deleteBlogById);
blogsRouter.put('/:id',     authorizatorAdmin, blogValidator, checkInputValidation,          blogControllers.putBlog);
blogsRouter.post('/',       authorizatorAdmin, blogValidator, checkInputValidation,          blogControllers.postBlog);

blogsRouter.get('/:id/posts',                                                           blogControllers.getPostByBlog);
blogsRouter.post('/:id/posts', authorizatorAdmin, postForBlogValidator, checkInputValidation, blogControllers.postPostByBlog);
  