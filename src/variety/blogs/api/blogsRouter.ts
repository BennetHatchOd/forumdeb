import {Router} from 'express';
import { blogControllers } from './blogControllers';
import { blogValidator } from './middleware/blogValidator';
import { authorizatorAdmin } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/checkInputValidators'
import { postForBlogValidator } from '../posts/middleware/postValidator';
import { URL_PATH } from '../../../setting';

export const blogsRouter = Router({});

blogsRouter.get('/',                           blogControllers.getBlog);
blogsRouter.get('/:id',                                                                 blogControllers.getBlogById);
blogsRouter.delete('/:id',  authorizatorAdmin,                                               blogControllers.deleteBlogById);
blogsRouter.put('/:id',     authorizatorAdmin, blogValidator, checkInputValidation,          blogControllers.putBlog);
blogsRouter.post('/',       authorizatorAdmin, blogValidator, checkInputValidation,          blogControllers.postBlog);

blogsRouter.get('/:id/posts',                                                           blogControllers.getPostByBlog);
blogsRouter.post('/:id/posts', authorizatorAdmin, postForBlogValidator, checkInputValidation, blogControllers.postPostByBlog);
  