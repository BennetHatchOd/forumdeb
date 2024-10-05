import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../setting";
import { authService } from "./authSevice";
import { CodStatus, StatusResult } from "../../types/interfaces";
import { AboutUser, LoginInputModel } from "./types";
import { json } from "stream/consumers";

export const authControllers = { 
    async postLogin(req: Request<{},{},LoginInputModel>, res: Response){
        try{
            const answerValid = authService.isValid(req.body.loginOrEmail, req.body.password)

            if(answerValid.codResult == CodStatus.BadRequest){
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(answerValid.data)
                return
            }
            const userToken = await authService.authUser(req.body.loginOrEmail, req.body.password)
            if(userToken.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return
            }
            res.status(HTTP_STATUSES.NO_CONTENT_204).json({"accessToken": userToken.data!}) 
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