import {Router} from 'express';
import { postValidator } from './middleware/post.validator';
import { authorizatorAdmin, authorizatorUser } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';
import { commentControllers, postControllers } from '../../../instances';
import { commentValidator } from '../../comments/api/middleware/comment.validator';

export const postsRouter = Router({});

postsRouter.get('/',  postControllers.get);
postsRouter.get('/:id', postControllers.getPostById);
postsRouter.delete('/:id', authorizatorAdmin,  postControllers.deletePostById);
postsRouter.put('/:id', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.put);
postsRouter.post('/', authorizatorAdmin,  postValidator, checkInputValidation, postControllers.post);

postsRouter.get('/:id/comments', commentControllers.getCommentToPost);
postsRouter.post('/:id/comments', authorizatorUser,  commentValidator, checkInputValidation, commentControllers.postCommentToPost);
