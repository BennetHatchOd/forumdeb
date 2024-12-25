import {Router} from 'express';
import { authControllers } from './auth.controller';
import { authSplitValidator, authValidator, codeValidator, emailValidator } from './middleware/auth.validator';
import { AUTH_PATH } from '../../../setting';
import { rateLimiting } from '../../../midlleware/rate.limiting';
import { authorizatorUser } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';

export const authRouter = Router({});

authRouter.post(AUTH_PATH.login, rateLimiting, authSplitValidator, checkInputValidation, authControllers.authorization)
authRouter.post(AUTH_PATH.confirm, rateLimiting, codeValidator, checkInputValidation, authControllers.confirmation)
authRouter.post(AUTH_PATH.registration, rateLimiting, authValidator, checkInputValidation, authControllers.registration)
authRouter.post(AUTH_PATH.resent, rateLimiting, emailValidator, checkInputValidation, authControllers.reSendMail)
authRouter.post(AUTH_PATH.refresh, authControllers.updateRefrashToken)
authRouter.post(AUTH_PATH.logout, authControllers.logOut)
authRouter.get(AUTH_PATH.me, authorizatorUser, authControllers.getMe)

  
