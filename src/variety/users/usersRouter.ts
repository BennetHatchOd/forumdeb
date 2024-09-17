import {Router} from 'express';
import { getUserController } from './controllers/getUserController';
import { deleteUserByIdController } from './controllers/deleteUserByIdController';
import { postUserController } from './controllers/postUserController';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { paginatorValidator } from '../../midlleware/paginatorValidator';
import { userValidator } from './middleware/userValidator';

export const usersRouter = Router({});

usersRouter.get('/', authorizator, paginatorValidator, getUserController);
usersRouter.delete('/:id', authorizator, deleteUserByIdController);
usersRouter.post('/', authorizator, userValidator, checkInputValidation, postUserController);

  