export type LoginInputModel = {
    loginOrEmail:	string,
    password:	string,
}

export type AboutUser = {
    email:      string,
    login:      string,
    userId:     string
  }

export type Tokens = {
    accessToken: string, 
    refreshToken: string}