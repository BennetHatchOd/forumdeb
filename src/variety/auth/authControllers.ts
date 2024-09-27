import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../setting";
import { authService } from "./authSevice";
import { LoginInputModel } from "../../types";
import { CodStatus } from "../../interfaces";

export const authControllers = { 
    async postLogin(req: Request<{},{},LoginInputModel>, res: Response){
        try{
            const answerValid = authService.isValid(req.body.loginOrEmail, req.body.password)

            if(answerValid.codResult == CodStatus.BadRequest){
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(answerValid.data)
                return
            }
            const status: number = 
                await authService.authUser(req.body.loginOrEmail, req.body.password) 
                    ? HTTP_STATUSES.CREATED_201 
                    : HTTP_STATUSES.NO_AUTHOR_401
            
            res.sendStatus(status);
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }
}