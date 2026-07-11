
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtiles } from "../../utils/token";
import { IChangePasswordChange, IRegisterPatientPayload, loginUserPayload } from "./auth.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVerse } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";



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


// get the logged-in user's info 
const getMe = async(user:IRequestUser) =>{

    const isUserExists = await prisma.user.findUnique({
        where: {
            id : user.userId
        },
        include: {            
            patient:{
                include: {
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                    patientHealthDatas: true
                },                
            },
            doctor: {
                include: {
                    specialities: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true
                },
            },
            admins: true
        }
    })

    if(!isUserExists) {
        throw new AppError(status.NOT_FOUND, 'admin not found!')
    }

    return isUserExists
}




// new refresh token to generate new access token 
const getNewToken = async(refreshToken:string, sessionToken:string ) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,            
        },
        include: {
            user: true
        }
    })

    if(!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token error!")
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVerse.REFRESH_TOKEN_SECRET);

    if(!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token error!")
    }

    const data = verifiedRefreshToken.data as JwtPayload 

    // new access token and refresh token generate part
    const newAccessToken = tokenUtiles.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email:data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })

    const newRefreshToken = tokenUtiles.getRefreshToken({
        userId: data.id,
        role: data.role,
        name: data.name,
        email:data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })


    const {token} = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt : new Date(Date.now() + 60 * 60 * 24 * 1000),   // increase the session by 1 day and converts to miliseconds
            updatedAt: new Date(),
        }

    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token,
    }
}



const changePassworrd = async(payload:IChangePasswordChange, sessionToken:string) => {

    const session = await auth.api.getSession({
        headers: new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(!session) {
        throw new AppError(status.UNAUTHORIZED, "Session not found for password change!")
    } 

    const {currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })


    return result

}







export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassworrd
}
