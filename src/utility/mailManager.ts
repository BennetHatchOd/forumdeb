import { mailAdapter } from "../adapters/mailAdapter"

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
        `To confirm your registration, follow the link
        https://some-front.com/auth/confirm-registration?code=${code}`
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
