import {Router} from 'express';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { paginatorValidator } from '../../midlleware/paginatorValidator';
import { userValidator } from './middleware/userValidator';
import { userControllers } from './controllers/userControllers';

export const usersRouter = Router({});

usersRouter.get('/', authorizator, paginatorValidator, checkInputValidation, userControllers.getUser);
usersRouter.delete('/:id', authorizator, userControllers.deleteUserById);
usersRouter.post('/', authorizator, userValidator, checkInputValidation, userControllers.postUser);

  
