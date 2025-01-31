import {body} from 'express-validator'
import { blogIdExistValidator } from '../../../../midlleware/isExist'

export const titleValidator = body('title').trim()
                .isLength({min: 1, max: 30})
                .withMessage("Not correct title's length")

export const shortDescValidator = body('shortDescription').trim()
                                                          .isLength({min: 1, max: 100})
                                                          .withMessage("Not correct description's length")

export const contentValidator =  body('content').trim()
                                                .isLength({min: 1, max: 100})
                                                .withMessage("Not correct content's length")


export const postValidator = [
    titleValidator,
    shortDescValidator,
    contentValidator,
    blogIdExistValidator,
]

export const postForBlogValidator = [
    titleValidator,
    shortDescValidator,
    contentValidator,
]

