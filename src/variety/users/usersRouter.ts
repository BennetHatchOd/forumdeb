import {Router} from 'express';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { userValidator } from './middleware/userValidator';
import { userControllers } from './controllers/userControllers';

export const usersRouter = Router({});

usersRouter.get('/', authorizator,  userControllers.getUser);
usersRouter.delete('/:id', authorizator, userControllers.deleteUserById);
usersRouter.post('/', authorizator, userValidator, checkInputValidation, userControllers.postUser);

  
