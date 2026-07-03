
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtiles } from "../../utils/token";
import { IRegisterPatientPayload, loginUserPayload } from "./auth.interface";



const registerPatient = async (payload: IRegisterPatientPayload) => {

        const {name, email, password} = payload;

        //? FIRST CREATE A USER. then create the patient 
        const data = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            }
        })     
        console.log('data:', data);   // user is created in "data.user"

        if(!data.user) {
            // throw new Error("failed to create patient!")
            throw new AppError(status.BAD_REQUEST, "failed to creare patient!")            
        }

        // create patient profile while creating user (transaction)
        try {
            const patient = await prisma.$transaction(async (tx) => {
                const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email,
                }
            })
            return patientTx
        
        })

        const accessToken = tokenUtiles.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email:data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })

        const refreshToken = tokenUtiles.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email:data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })

        return {
            ...data,
            patient,
            accessToken,
            refreshToken
        };
        } catch (error) {
            console.log("transaction error:", error);
            await prisma.user.delete({
                where: {
                    id:data.user.id
                }
            })
            throw error
        }
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
        // throw new Error("User is blocked!")
        throw new AppError(status.FORBIDDEN, "User is blocked")
    }

    else if(data.user.isDeleted || data.user.status === UserStatus.DELETED ) {
        // throw new Error("User is deleted!")
        throw new AppError(status.NOT_FOUND, "User is deleted!")
    }

    const accessToken = tokenUtiles.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email:data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })

    const refreshToken = tokenUtiles.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email:data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })
    
    return {
        ...data,
        accessToken,
        refreshToken
    };
}


export const AuthService = {
    registerPatient,
    loginUser
}
