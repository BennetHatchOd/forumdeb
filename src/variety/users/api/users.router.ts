import {Router} from 'express';
import { authorizatorAdmin } from '../../../midlleware/authorization';
import {checkInputValidation} from '../../../midlleware/checkInputValidators'
import { userValidator } from '../middleware/user.validator';
import { UserControllers} from './user.controllers';
import { UserService } from '../application/user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserQueryRepository } from '../repositories/user.query.repository';
import { AuthRepository } from '../../auth/authRepository';

export const usersRouter = Router({});
const userRepository = new UserRepository()
const authRepository = new AuthRepository()
const userQueryRepository = new UserQueryRepository()
const userService = new UserService(userRepository, authRepository)
const userControllers = new UserControllers(userService, userQueryRepository)

usersRouter.get('/', authorizatorAdmin,  userControllers.getUser);
usersRouter.delete('/:id', authorizatorAdmin, userControllers.deleteUserById);
usersRouter.post('/', authorizatorAdmin, userValidator, checkInputValidation, userControllers.postUser);

  
