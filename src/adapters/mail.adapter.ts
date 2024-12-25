import nodemailer from 'nodemailer'
import { PASSWORD_MAIL } from '../setting'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vng114.work@gmail.com',
        pass: PASSWORD_MAIL
    }
})


export const mailAdapter = { 
    
    async createEmail(mailTo: string, subject: string, message: string){
        
        const mailOptions = {
          from: 'vng114.work@gmail.com',
          to: mailTo,
          subject: subject,
          html: message
        }
        return await transporter.sendMail(mailOptions)
    }
 //   createEmail(){
    //     return new Promise((resolve, reject) => {
    //         transporter.sendMail(mailOptions, (error, info) => {
    //             if (error) {
    //                 reject(error)
    //             }
    //             resolve(info)})
    //         })
    // }


}




