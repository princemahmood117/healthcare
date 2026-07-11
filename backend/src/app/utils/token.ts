import { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtUtils } from "./jwt"
import { envVerse } from "../../config/env"
import { Response } from "express"
import { cookieUtils } from "./cookie"



const getAccessToken = (payload:JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVerse.ACCESS_TOKEN_SECRET, {expiresIn: envVerse.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)

    return accessToken

}


const getRefreshToken = (payload:JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVerse.REFRESH_TOKEN_SECRET, {expiresIn: envVerse.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)

    return refreshToken;
}



const setAccessTokenCookie = (res:Response, token:string) => {

    cookieUtils.setCookie(res, "accessToken", token, {
        httpOnly: true,
        sameSite:"none",
        secure:true,
        maxAge: 60*60*60*24,   // for 1d
        path: '/'
    })

}



const setRefreshTokenCookie = (res:Response, token:string) => {

    cookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60*60*60*24*7,  // for 7d
        path: '/'        
    })
}


const setBetterAuthSessionCookie = (res:Response, token:string) => {

        cookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60*60*60*24,   // for 1d
        path: '/'      
    })
}

// better-auth-session-token AND access-token will have same to same 'MaxAge'




export const tokenUtiles = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
}