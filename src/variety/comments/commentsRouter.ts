import {Router} from 'express';
import { commentControllers } from './commentControllers';
import { commentValidator } from './middleware/commentValidator';
import { authorizatorUser } from '../../midlleware/authorization';
import {checkInputValidation} from '../../midlleware/checkInputValidators'

export const commentsRouter = Router({});

commentsRouter.get('/:id',                                                                 commentControllers.getCommentById);
commentsRouter.delete('/:id',  authorizatorUser,                                               commentControllers.deleteComment);
commentsRouter.put('/:id',     authorizatorUser, commentValidator, checkInputValidation,       commentControllers.putComment);

  