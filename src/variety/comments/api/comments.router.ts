import {Router} from 'express';
import { commentControllers } from './comment.controller';
import { commentValidator } from './middleware/comment.validator';
import { authorizatorUser } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'

export const commentsRouter = Router({});

commentsRouter.get('/:id',                                                                 commentControllers.getCommentById);
commentsRouter.delete('/:id',  authorizatorUser,                                               commentControllers.deleteComment);
commentsRouter.put('/:id',     authorizatorUser, commentValidator, checkInputValidation,       commentControllers.putComment);

  