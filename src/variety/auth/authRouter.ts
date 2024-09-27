import {Router} from 'express';
import { authControllers } from './authControllers';

export const authRouter = Router({});

authRouter.post('/login', authControllers.postLogin);

  
