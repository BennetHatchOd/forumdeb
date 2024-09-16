import {body} from 'express-validator'

export const loginValidator = body('login').trim()
                                         .isLength({min: 3, max: 10})
                                         .withMessage("Not correct login's length")

export const passwordValidator = body('password').trim() 
                                                    .isLength({min: 6, max: 20})
                                                       .withMessage("Not correct description's length")

export const emailValidator = body('email').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
                                                 .withMessage("Not correct email")



export const userValidator = [
    loginValidator,
    passwordValidator,
    emailValidator,
]

