export type LoginInputType = {
    loginOrEmail:	string,
    password:	    string,
}

export type AuthorizationType = {
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
