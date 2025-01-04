import { Request, Response } from "express";
import { AboutUser, AuthorizationType, LoginInputType, Tokens } from "../types";
import { APIErrorResult, CodStatus, StatusResult } from "../../../types/types";
import { HTTP_STATUSES } from "../../../setting";
import { UserInputType } from "../../users/types";
import { AuthService } from "../application/auth.service";


export class AuthControllers{ 

    constructor(private authService: AuthService){}
  
    async authorization(req: Request<{},{},LoginInputType>, res: Response){
        try{   
            const device =  req.headers['user-agent']
                     ? req.headers['user-agent'] 
                     : 'unknown device'       
            const user: AuthorizationType = {
                                            loginOrEmail:	req.body.loginOrEmail,
                                            password:	    req.body.password,
                                            deviceName:     device,
                                            ip:             req.ip!
                                        }
            const userTokens = await this.authService.authorization(user)
 
            if(userTokens.codResult == CodStatus.NotAuth){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return;
            }
            res.cookie('refreshToken', userTokens.data!.refreshToken, {httpOnly: true, secure: true,})
            res.status(HTTP_STATUSES.OK_200).json({"accessToken": userTokens.data!.accessToken}) 
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }

    async updateRefrashToken(req: Request, res:Response){
        try{    
            const userTokens: StatusResult<Tokens | undefined> 
                = await this.authService.refreshingTokens(req.payload!)
            if (userTokens.codResult != CodStatus.Ok){
                res.sendStatus(HTTP_STATUSES.NO_AUTHOR_401)
                return;
            }
            res.cookie('refreshToken', userTokens.data!.refreshToken, {httpOnly: true, secure: true,})
            res.status(HTTP_STATUSES.OK_200).json({ "accessToken": userTokens.data!.accessToken})
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }       
    }

    async logOut(req: Request, res:Response){
        try{  
 
            const answerLogOut = await this.authService.logOut(req.payload!)
            res.status(answerLogOut.codResult).send({})
        }          
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }

    async confirmation(req: Request<{},{code:string}>, res: Response){
        try{
            const answer: StatusResult<APIErrorResult|undefined> = await this.authService.confirmationUser(req.body.code)
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
    }

    async registration(req: Request<{},{},UserInputType>, res: Response){
        try{
           const inputUserData: UserInputType ={
             login: req.body.login,
             email: req.body.email,
             password: req.body.password
           }             
           const registrAnswer: StatusResult<undefined|APIErrorResult> = await this.authService.registrationUser(inputUserData)
           res.status(registrAnswer.codResult).json(registrAnswer.data)
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }

    async reSendMail(req: Request, res: Response){
        try{
           const sendAnswer: StatusResult<undefined|APIErrorResult> = await this.authService.reSendEmail(req.body.email) 
           res.status(sendAnswer.codResult).json(sendAnswer.data)            
        }
        catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.ERROR_500)
        }
    }

    async getMe(req: Request, res: Response){
        try{
            const answer: StatusResult<AboutUser|undefined> = (await this.authService.aboutMe(req.user!.id))

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