import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../setting";
import { authService } from "./authSevice";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { AboutUser, LoginInputModel } from "./types";
import { APIErrorResult } from "../../types/types";
import { UserInputModel } from "../users/types";

export const authControllers = { 
  
    async authorization(req: Request<{},{},LoginInputModel>, res: Response){
        try{
            
            const userToken = await authService.authorization(req.body.loginOrEmail, req.body.password)
 
            if(userToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return
            }
            res.status(HTTP_STATUSES.OK_200).json({"accessToken": userToken.data!}) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    },

    async confirmation(req: Request<{},{code:string}>, res: Response){
        try{
            const answer: StatusResult<APIErrorResult|undefined> = await authService.confirmationUser(req.body.code)
            if(answer.codResult == CodStatus.NoContent){
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return;
            }          
            res.status(answer.codResult).json(answer.data) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    },

    async registration(req: Request<{},{},UserInputModel>, res: Response){
        try{
           const inputUserData: UserInputModel ={
             login: req.body.login,
             email: req.body.email,
             password: req.body.password
           }             
           const registrAnswer: StatusResult = await authService.registrationUser(inputUserData)
           res.sendStatus(registrAnswer.codResult)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    },

    async reSendMail(req: Request, res: Response){
        try{
           const sendAnswer: StatusResult = await authService.reSendEmail(req.body.email) 
           res.sendStatus(sendAnswer.codResult)            
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    },

    async getMe(req: Request, res: Response){
        try{
            const answer: StatusResult<AboutUser|undefined> = (await authService.aboutMe(req.user!.id))

            if(answer.codResult == CodStatus.Ok){
                res.status(HTTP_STATUSES.OK_200).json(answer.data)
                return;
            }
            res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)

        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }
}