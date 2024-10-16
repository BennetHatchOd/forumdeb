import {body} from 'express-validator'

const loginTemplate = /^[a-zA-Z0-9_-]*$/
const emailTemplate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const codeTemplate = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/     


export const loginEmailValidator = body('loginOrEmail').custom(async(value) => {
            if(!emailTemplate.test(value) 
                || !(loginTemplate.test(value) && value.length > 2 && value.length < 11 )
            ){
                throw('Login or email has incorrect values')
            }
        })
                                         
export const loginValidator = body('login').custom(async(value) => {
    if( !(loginTemplate.test(value) && value.length > 2 && value.length < 11 )){
        throw('Login has incorrect values')
    }
})

export const emailValidator = body('email').custom(async(value) => {
    if(!emailTemplate.test(value)){
        throw('email has incorrect values')
    }
})

export const codeValidator = body('code').custom(async(value) => {
    if(!codeTemplate.test(value)){
        throw('code has incorrect values')
    }
})

export const passwordValidator = body('password').trim() 
                                                       .isLength({min: 6, max: 20})
                                                       .withMessage("password has incorrect length")


export const authValidator = [
        loginValidator,
        emailValidator,
        passwordValidator,
    ]

export const authSplitValidator = [
    loginEmailValidator,
    passwordValidator,
]
