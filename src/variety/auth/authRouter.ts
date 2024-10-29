import {Router} from 'express';
import { authControllers } from './authControllers';
import { authorizatorUser } from '../../midlleware/authorization';
import { authSplitValidator, authValidator, codeValidator, emailValidator } from './middleware/authValidator';
import { checkInputValidation } from '../../midlleware/checkInputValidators';

export const authRouter = Router({});

authRouter.post('/login', authSplitValidator, checkInputValidation, authControllers.authorization)
authRouter.post('/registration-confirmation', codeValidator, checkInputValidation, authControllers.confirmation)
authRouter.post('/registration', authValidator, checkInputValidation, authControllers.registration)
authRouter.post('/registration-email-resending', emailValidator, checkInputValidation, authControllers.reSendMail)
authRouter.post('/refresh-token', authControllers.updateRefrashToken)
authRouter.post('/logout', authControllers.logOut)
authRouter.get('/me', authorizatorUser, authControllers.getMe)

  
