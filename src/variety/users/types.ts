import { ConfirmEmailType } from "../auth/domain/confirm.email.entity"

export type UserInputType = {
    login:	string,         // unique, length 3-10, ^[a-zA-Z0-9_-]*$
    password:	string,     // length: 6-20
    email:	string,         // unique, ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
}

export type UserViewType = {
    id:	string,
    login:	string,
    email:	string,
    createdAt:	string
}

export type UserIdType = {
    id:     string,
    login:	        string,
    email:	        string,
    password:       string,
    createdAt:	    Date, 
    isConfirmEmail: boolean,
    confirmEmail:   ConfirmEmailType,
}

