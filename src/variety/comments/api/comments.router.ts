import {Router} from 'express';
import { commentValidator } from './middleware/comment.validator';
import { authUserByAccessT, throughAccessToken } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { commentControllers, likeControllers } from '../../../instances';

export const commentsRouter = Router({});

commentsRouter.get('/:id', throughAccessToken, commentControllers.getById.bind(commentControllers));
commentsRouter.delete('/:id', authUserByAccessT, commentControllers.delete.bind(commentControllers));
commentsRouter.put('/:id', authUserByAccessT, commentValidator, checkInputValidation, commentControllers.put.bind(commentControllers));
commentsRouter.put('/:id/like-status', authUserByAccessT, likeControllers.rangeComment.bind(likeControllers));

