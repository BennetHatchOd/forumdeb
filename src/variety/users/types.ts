export type UserInputModel = {
    login:	string,         // unique, length 3-10, ^[a-zA-Z0-9_-]*$
    password:	string,     // length: 6-20
    email:	string,         // unique, ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
}

export type UserViewModel = {
    id:	string,
    login:	string,
    email:	string,
    createdAt:	string
}

export type UserPasswordModel = {
    id:	string,
    login:	string,
    email:	string,
    createdAt:	string,
    password: string,
}

export type UserUnconfirmedModel = {
    id:     string,
    user:{
        login:	string,
        email:	string,
        password: string,
        createdAt:	string
    }
    confirmEmail: {
        code: string,
        expirationTime: string,
        countSendingCode: number
    }
}

export type ConfirmEmailModel = {
    code: string,
    expirationTime: string,
    countSendingCode: number
}
