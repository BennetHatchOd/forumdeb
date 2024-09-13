import {query} from 'express-validator'

// export const searchNameValidator = query('searchNameTerm').

// export const sortByValidator = query('sortBy').trim() 

export const sortDirectionValidator = query('sortDirection').isIn(['asc', 'desc'])
                                                 .withMessage("Not correct value")

export const pageNumberValidator = query('pageNumber').custom((value) =>{
                                                    if( value < 1 || (Math.floor(value) - value != 0))
                                                        throw 'pageNamber should be a natural number' })
                                                    
export const pageSizeValidator = query('pageSize').custom((value) =>{
                                                    if( value < 1 || (Math.floor(value) - value != 0))
                                                        throw 'pageNamber should be a natural number' })


export const paginatorValidator = [
            sortDirectionValidator,
            pageNumberValidator,
            pageSizeValidator,
     ]

    