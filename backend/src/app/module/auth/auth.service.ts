
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";


interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {

    try {

        const {name, email, password} = payload;
        const data = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            }
        })        

        if(!data.user) {
            throw new Error("failed to create patient!")
        }

        // todo: create patient profile after signup 
        // transaction is used to work on two different models
        // const patient = await prisma.$transaction(async (tx) => {
        
        // })
        console.log('data:', data);

        return data;

    } catch (error) {
        console.log(error);
    }
}

interface loginUserPayload {
    email: string;
    password: string
}

const loginUser = async (payload: loginUserPayload) => {

    const {email,password} = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if(data.user.status === UserStatus.BLOCKED) {
        throw new Error("User is blocked!")
    }

    else if(data.user.isDeleted || data.user.status === UserStatus.DELETED ) {
        throw new Error("User is deleted!")
    }
    
    return data;
}


export const AuthService = {
    registerPatient,
    loginUser
}
