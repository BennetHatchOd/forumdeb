import {Router} from 'express';
import { authorizatorAdmin } from '../../midlleware/authorization';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { userValidator } from './middleware/userValidator';
import { userControllers } from './userControllers';

export const usersRouter = Router({});

usersRouter.get('/', authorizatorAdmin,  userControllers.getUser);
usersRouter.delete('/:id', authorizatorAdmin, userControllers.deleteUserById);
usersRouter.post('/', authorizatorAdmin, userValidator, checkInputValidation, userControllers.postUser);

  
