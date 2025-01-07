import { MailAdapter } from "../adapters/mail.adapter"

export class MailManager { 

    constructor(private mailAdapter: MailAdapter){}

    async createConfirmEmail(mail: string, code: string){
        const message = 
          `<h1>Thank for your registration</h1>
          <p> To finish registration please follow the link below:
              <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
          </p>`

        await this.mailAdapter.createEmail(mail, 'registration confirmation', message)
    }

    async createPasswordRecovery(mail: string, code: string){
        const message = 
        `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`
    
      await this.mailAdapter.createEmail(mail, 'password-recovery', message)
    }

}
