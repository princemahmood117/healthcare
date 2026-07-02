import { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtUtils } from "./jwt"
import { envVerse } from "../../config/env"


const getAccessToken = (payload:JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVerse.ACCESS_TOKEN_SECRET, {expiresIn: envVerse.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)

    return accessToken

}


const getRefreshToken = (payload:JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVerse.REFRESH_TOKEN_SECRET, {expiresIn: envVerse.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)

    return refreshToken;
}


export const tokenUtiles = {
    getAccessToken,
    getRefreshToken
}