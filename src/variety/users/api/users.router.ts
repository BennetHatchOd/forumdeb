import {Router} from 'express';
import { authAdminByPassword } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/check.input.validators'
import { userValidator } from './middleware/user.validator';
import { userControllers } from '../../../instances';

export const usersRouter = Router({});

usersRouter.get('/', authAdminByPassword,  userControllers.getUser);
usersRouter.delete('/:id', authAdminByPassword, userControllers.deleteUserById);
usersRouter.post('/', authAdminByPassword, userValidator, checkInputValidation, userControllers.postUser);

  
