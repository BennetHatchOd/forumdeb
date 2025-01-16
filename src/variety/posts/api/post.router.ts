import {Router} from 'express';
import { postValidator } from './middleware/post.validator';
import { authAdminByPassword, authUserByAccessT } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';
import { commentControllers, postControllers } from '../../../instances';
import { commentValidator } from '../../comments/api/middleware/comment.validator';

export const postsRouter = Router({});

postsRouter.get('/',  postControllers.get.bind(postControllers));
postsRouter.get('/:id', postControllers.getById.bind(postControllers));
postsRouter.delete('/:id', authAdminByPassword,  postControllers.deleteById.bind(postControllers));
postsRouter.put('/:id', authAdminByPassword,  postValidator, checkInputValidation, postControllers.put.bind(postControllers));
postsRouter.post('/', authAdminByPassword,  postValidator, checkInputValidation, postControllers.post.bind(postControllers));

postsRouter.get('/:id/comments', commentControllers.getForPost.bind(commentControllers));
postsRouter.post('/:id/comments', authUserByAccessT,  commentValidator, checkInputValidation, commentControllers.postForPost.bind(commentControllers));
