import {body} from 'express-validator'

export const contentValidator = body('content').trim()
                                         .isLength({min: 20, max: 30})
                                         .withMessage("Not correct content's length")


export const commentValidator = [
        contentValidator,
    ]

