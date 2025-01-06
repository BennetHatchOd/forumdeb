import {Router} from 'express';
import { commentValidator } from './middleware/comment.validator';
import { authUserByAccessT } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { commentControllers } from '../../../instances';

export const commentsRouter = Router({});

commentsRouter.get('/:id', commentControllers.getCommentById.bind(commentControllers));
commentsRouter.delete('/:id', authUserByAccessT, commentControllers.deleteComment.bind(commentControllers));
commentsRouter.put('/:id', authUserByAccessT, commentValidator, checkInputValidation, commentControllers.putComment.bind(commentControllers));

  