export type LoginInputModel = {
    loginOrEmail:	string,
    password:	    string,
}

export type AuthorizationModel = {
  loginOrEmail:	string,
  password:	    string,
  deviceName:   string,
  ip:           string
}


export type AboutUser = {
    email:      string,
    login:      string,
    userId:     string
  }

export type Tokens = {
    accessToken:  string, 
    refreshToken: string
  }
