import nodemailer from 'nodemailer'
import { PASSWORD_MAIL } from '../setting'

export class MailAdapter { 
    
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vng114.work@gmail.com',
            pass: PASSWORD_MAIL
        }
    })

    async createEmail(mailTo: string, subject: string, message: string){
        
        const mailOptions = {
          from: 'vng114.work@gmail.com',
          to: mailTo,
          subject: subject,
          html: message
        }
        return await this.transporter.sendMail(mailOptions)
    }
}





