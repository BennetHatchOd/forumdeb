import {Router} from 'express';
import { authControllers } from './authControllers';
import { authorizatorUser } from '../../midlleware/authorization';
import { authSplitValidator, authValidator, codeValidator, emailValidator } from './middleware/authValidator';
import { checkInputValidation } from '../../midlleware/checkInputValidators';
import { AUTH_PATH } from '../../setting';
import { rateLimiting } from '../../midlleware/rateLimiting';

export const authRouter = Router({});

authRouter.post(AUTH_PATH.login, authSplitValidator, checkInputValidation, authControllers.authorization)
authRouter.post(AUTH_PATH.confirm, codeValidator, checkInputValidation, authControllers.confirmation)
authRouter.post(AUTH_PATH.registration, rateLimiting, authValidator, checkInputValidation, authControllers.registration)
authRouter.post(AUTH_PATH.resent, emailValidator, checkInputValidation, authControllers.reSendMail)
authRouter.post(AUTH_PATH.refresh, authControllers.updateRefrashToken)
authRouter.post(AUTH_PATH.logout, authControllers.logOut)
authRouter.get(AUTH_PATH.me, authorizatorUser, authControllers.getMe)

  
