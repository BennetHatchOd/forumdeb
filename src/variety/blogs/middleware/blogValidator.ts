import {body} from 'express-validator'

export const nameValidator = body('name').trim()
                                         .isLength({min: 1, max: 15})
                                         .withMessage("Not correct name's length")

export const descriptionValidator = body('description').trim() 
                                                       .isLength({max: 500})
                                                       .withMessage("Not correct description's length")

export const webUrlValidator = body('websiteUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
                                                 .withMessage("Not correct url adress")

export const webLengthValidator = body('websiteUrl').isLength({max: 100})
                                                    .withMessage("Not correct url's length")

export const blogValidator = [
        nameValidator,
        descriptionValidator,
        webLengthValidator,
        webUrlValidator,
    ]

