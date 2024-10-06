import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../setting";
import { authService } from "./authSevice";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { AboutUser, LoginInputModel } from "./types";

export const authControllers = { 
    async postLogin(req: Request<{},{},LoginInputModel>, res: Response){
        try{
            
            const userToken = await authService.authUser(req.body.loginOrEmail, req.body.password)
 
            if(userToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return
            }
            if(userToken.codResult == CodStatus.BadRequest){
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(userToken.data)
                return
            }
            res.status(HTTP_STATUSES.OK_200).json({"accessToken": userToken.data!}) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    },

    async getMe(req: Request, res: Response){
        try{
            const answer: StatusResult<AboutUser|undefined> = (await authService.aboutMe(req.user!.id))

            console.log('answer = ', answer)
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