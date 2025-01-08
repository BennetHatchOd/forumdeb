import {Router} from 'express';
import { authSplitValidator, authValidator, codeValidator, emailValidator, newPassValidator } from './middleware/auth.validator';
import { AUTH_PATH } from '../../../setting/setting.path.name';
import { rateLimiting } from '../../../midlleware/rate.limiting';
import { authUserByAccessT, authUserByRefreshT } from '../../../midlleware/authorization';
import { checkInputValidation } from '../../../midlleware/check.input.validators';
import { authControllers } from '../../../instances';

export const authRouter = Router({});

authRouter.post(AUTH_PATH.login, rateLimiting, authSplitValidator, checkInputValidation, authControllers.authorization.bind(authControllers))
authRouter.post(AUTH_PATH.logout, authUserByRefreshT, authControllers.logOut.bind(authControllers))

authRouter.post(AUTH_PATH.registration, rateLimiting, authValidator, checkInputValidation, authControllers.registration.bind(authControllers))
authRouter.post(AUTH_PATH.confirm, rateLimiting, codeValidator, checkInputValidation, authControllers.confirmation.bind(authControllers))
authRouter.post(AUTH_PATH.resent, rateLimiting, emailValidator, checkInputValidation, authControllers.reSendMail.bind(authControllers))

//authRouter.post(AUTH_PATH.askNewPassword, authControllers.askNewPassword.bind(authControllers))
 authRouter.post(AUTH_PATH.askNewPassword, rateLimiting, emailValidator, checkInputValidation, authControllers.askNewPassword.bind(authControllers))
authRouter.post(AUTH_PATH.resentPassword, rateLimiting, codeValidator, newPassValidator, checkInputValidation, authControllers.resentPassword.bind(authControllers))

authRouter.post(AUTH_PATH.refresh, authUserByRefreshT, authControllers.updateRefrashToken.bind(authControllers))
authRouter.get(AUTH_PATH.me, authUserByAccessT, authControllers.getMe.bind(authControllers))

  
