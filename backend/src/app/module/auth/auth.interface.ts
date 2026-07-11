


// REGISTER
export interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

// LOGIN
export interface loginUserPayload {
    email: string;
    password: string
}


// CHANGE-PASSWORD
export interface IChangePasswordChange {

    currentPassword: string;
    newPassword : string;
}