import {Router} from 'express';
import { getUserController } from '../../../oldControllers/getUserController';
import { deleteUserByIdController } from '../../../oldControllers/deleteUserByIdController';
import { postUserController } from '../../../oldControllers/postUserController';
import { authorizator } from '../../midlleware/authorizator';
import {checkInputValidation} from '../../midlleware/checkInputValidators'
import { paginatorValidator } from '../../midlleware/paginatorValidator';
import { userValidator } from './middleware/userValidator';

export const usersRouter = Router({});

usersRouter.get('/', authorizator, paginatorValidator, checkInputValidation, getUserController);
usersRouter.delete('/:id', authorizator, deleteUserByIdController);
usersRouter.post('/', authorizator, userValidator, checkInputValidation, postUserController);

  
