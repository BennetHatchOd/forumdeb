import { Response, Request, NextFunction } from "express";
import {FieldValidationError, validationResult} from 'express-validator';
import { HTTP_STATUSES } from "../setting";

export const checkInputValidation = (req: Request, res: Response, next: NextFunction) =>{
     
     if(validationResult(req).isEmpty()){
            next();
            return;
     }
  
    const resultError = validationResult(req).array({ onlyFirstError: true }).map(item => {
        const err = item as unknown as FieldValidationError
        
        return{
            message: err.msg,
            field:   err.path,
        }
    });

    res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: resultError});

}         


