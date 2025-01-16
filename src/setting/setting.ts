import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3014
export const SECRET_KEY = process.env.SECRET_KEY || '114' 
export const PASSCODE_ADMIN = process.env.PASSCODE_ADMIN || 'admin:qwerty' 
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL  

export const TIME_LIFE_ACCESS_TOKEN = 600    // sec
export const TIME_LIFE_REFRESH_TOKEN = 24*60*60   //sec

export const TIME_RATE_LIMITED = 10         // sec
export const COUNT_RATE_LIMITED = 5

export const LENGTH_VERSION_ID = 7          // for version refresh-token and deviceId
export const TIME_LIFE_EMAIL_CODE = 2       // hours
export const TIME_LIFE_PASSWORD_CODE = 2       // hours
