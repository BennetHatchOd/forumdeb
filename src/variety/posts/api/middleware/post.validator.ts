import {body} from 'express-validator'
import { CodStatus } from '../../../../types/types'
import { blogRepository } from '../../../../instances'

export const titleValidator = body('title').trim()
                .isLength({min: 1, max: 30})
                .withMessage("Not correct title's length")

export const shortDescValidator = body('shortDescription').trim()
                                                          .isLength({min: 1, max: 100})
                                                          .withMessage("Not correct description's length")

export const contentValidator =  body('content').trim()
                                                .isLength({min: 1, max: 100})
                                                .withMessage("Not correct content's length")

export const idValidator = body('blogId').custom(async(value) => {
                                                        if((await blogRepository.isExist(value)).codResult == CodStatus.NotFound)
                                                            throw("BlogId isn't correct")
                                                    })
                                             //.withMessage("BlogId isn't corect")

export const postValidator = [
    titleValidator,
    shortDescValidator,
    contentValidator,
    idValidator,
]

export const postForBlogValidator = [
    titleValidator,
    shortDescValidator,
    contentValidator,
]

