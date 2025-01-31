import {Router} from 'express';
import { postValidator } from './middleware/post.validator';
import { authAdminByPassword, authUserByAccessT, throughAccessToken } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';
import { commentControllers, likeControllers, postControllers } from '../../../instances';
import { commentValidator } from '../../comments/api/middleware/comment.validator';
import { likeValidator } from '../../likes/api/widdleware/like.validator';
import { postIdExistValidator } from '../../../midlleware/isExist';

export const postsRouter = Router({});

postsRouter.get('/', throughAccessToken,  postControllers.get.bind(postControllers));
postsRouter.get('/:id', throughAccessToken, postControllers.getById.bind(postControllers));
postsRouter.delete('/:id', authAdminByPassword,  postControllers.deleteById.bind(postControllers));
postsRouter.put('/:id', authAdminByPassword,  postValidator, checkInputValidation, postControllers.put.bind(postControllers));
postsRouter.post('/', authAdminByPassword,  postValidator, checkInputValidation, postControllers.post.bind(postControllers));

postsRouter.get('/:id/comments', throughAccessToken, commentControllers.getForPost.bind(commentControllers));
postsRouter.post('/:id/comments', authUserByAccessT,  commentValidator, checkInputValidation, commentControllers.postForPost.bind(commentControllers));
postsRouter.put('/:id/like-status', authUserByAccessT, postIdExistValidator, likeValidator, likeControllers.rangePost.bind(likeControllers));

