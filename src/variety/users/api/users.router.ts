import {Router} from 'express';
import { authorizatorAdmin } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { userValidator } from './middleware/user.validator';
import { userControllers } from '../../../instances';

export const usersRouter = Router({});

usersRouter.get('/', authorizatorAdmin,  userControllers.getUser);
usersRouter.delete('/:id', authorizatorAdmin, userControllers.deleteUserById);
usersRouter.post('/', authorizatorAdmin, userValidator, checkInputValidation, userControllers.postUser);

  
