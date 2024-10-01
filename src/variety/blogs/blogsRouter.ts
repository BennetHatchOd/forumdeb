import {Router} from 'express';
import { blogControllers } from './controllers/blogControllers';
import { blogValidator } from './middleware/blogValidator';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { postForBlogValidator } from '../posts/middleware/postValidator';
import { URL_PATH } from '../../setting';

export const blogsRouter = Router({});

blogsRouter.get('/',                           blogControllers.getBlog);
blogsRouter.get('/:id',                                                                 blogControllers.getBlogById);
blogsRouter.delete('/:id',  authorizator,                                               blogControllers.deleteBlogById);
blogsRouter.put('/:id',     authorizator, blogValidator, checkInputValidation,          blogControllers.putBlog);
blogsRouter.post('/',       authorizator, blogValidator, checkInputValidation,          blogControllers.postBlog);

blogsRouter.get('/:id/posts',                                                           blogControllers.getPostByBlog);
blogsRouter.post('/:id/posts', authorizator, postForBlogValidator, checkInputValidation, blogControllers.postPostByBlog);
  