import { mailAdapter } from "../adapters/mail.adapter"

const mailOptions = {
  from: 'vng114.work@gmail.com',
  to: 'vng114@ukr.net',
  subject: 'Hello World!',
  html: `
    <h1>Hello?</h1>
    <p>How are you?</p>
  `
}

export const mailManager = { 

    async createConfirmEmail(mail: string, code: string){
        const message = 
          `<h1>Thank for your registration</h1>
          <p> To finish registration please follow the link below:
              <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
          </p>`

        await mailAdapter.createEmail(mail, 'registration confirmation', message)
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
