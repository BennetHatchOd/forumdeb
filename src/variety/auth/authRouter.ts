import {Router} from 'express';
import { authControllers } from './authControllers';
import { authorizatorUser } from '../../midlleware/authorization';

export const authRouter = Router({});

authRouter.post('/login', authControllers.postLogin)
authRouter.get('/me', authorizatorUser, authControllers.getMe)

  
