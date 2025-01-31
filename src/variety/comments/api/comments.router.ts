import {Router} from 'express';
import { commentValidator } from './middleware/comment.validator';
import { authUserByAccessT, throughAccessToken } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { commentControllers, likeControllers } from '../../../instances';
import { likeValidator } from '../../likes/api/widdleware/like.validator';
import { commentIdExistValidator } from '../../../midlleware/isExist';

export const commentsRouter = Router({});

commentsRouter.get('/:id', throughAccessToken, commentControllers.getById.bind(commentControllers));
commentsRouter.delete('/:id', authUserByAccessT, commentControllers.delete.bind(commentControllers));
commentsRouter.put('/:id', authUserByAccessT, commentValidator, checkInputValidation, commentControllers.put.bind(commentControllers));
commentsRouter.put('/:id/like-status', authUserByAccessT, commentIdExistValidator, likeValidator, likeControllers.rangeComment.bind(likeControllers));

