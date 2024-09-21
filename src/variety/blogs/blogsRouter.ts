import {Router} from 'express';
import { blogControllers } from './controllers/blogControllers';
import { blogValidator } from './middleware/blogValidator';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { paginatorValidator } from '../../midlleware/paginatorValidator';
import { postForBlogValidator } from '../posts/middleware/postValidator';

export const blogsRouter = Router({});

blogsRouter.get('/',                      paginatorValidator, checkInputValidation,     blogControllers.getBlog);
blogsRouter.get('/:id',                                                                 blogControllers.getBlogById);
blogsRouter.delete('/:id',  authorizator,                                               blogControllers.deleteBlogById);
blogsRouter.put('/:id',     authorizator, blogValidator, checkInputValidation,          blogControllers.putBlog);
blogsRouter.post('/',       authorizator, blogValidator, checkInputValidation,          blogControllers.postBlog);

blogsRouter.get('/:id/posts',              paginatorValidator,checkInputValidation,     blogControllers.getPostByBlog);
blogsRouter.post('/:id/posts', authorizator, postForBlogValidator, checkInputValidation, blogControllers.postPostByBlog);
  