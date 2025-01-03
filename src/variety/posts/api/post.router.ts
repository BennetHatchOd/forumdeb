import {Router} from 'express';
import { postValidator } from './middleware/post.validator';
import { authAdminByPassword, authUserByAccessT } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';
import { commentControllers, postControllers } from '../../../instances';
import { commentValidator } from '../../comments/api/middleware/comment.validator';

export const postsRouter = Router({});

postsRouter.get('/',  postControllers.get);
postsRouter.get('/:id', postControllers.getById);
postsRouter.delete('/:id', authAdminByPassword,  postControllers.deleteById);
postsRouter.put('/:id', authAdminByPassword,  postValidator, checkInputValidation, postControllers.put);
postsRouter.post('/', authAdminByPassword,  postValidator, checkInputValidation, postControllers.post);

postsRouter.get('/:id/comments', commentControllers.getCommentToPost);
postsRouter.post('/:id/comments', authUserByAccessT,  commentValidator, checkInputValidation, commentControllers.postCommentToPost);
