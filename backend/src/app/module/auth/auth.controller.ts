import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtiles } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

// catchAsync is called using a function as parameter
const registerPatient = catchAsync (async(req:Request, res:Response) => {
        const payload = req.body;   
        
        console.log("payload: ", payload);
        const result = await AuthService.registerPatient(payload)

         const {accessToken, refreshToken, token, ...rest} = result;

        tokenUtiles.setAccessTokenCookie(res, accessToken);
        tokenUtiles.setRefreshTokenCookie(res, refreshToken);
        tokenUtiles.setBetterAuthSessionCookie(res, token as string);


        sendReponse(res,  {
            httpStatusCode: status.CREATED,
            success:true,
            message: "Patient registered successfully!",
            data: result
        })
    }
)


const loginUser = catchAsync (
    async (req:Request, res:Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload)

        const {accessToken, refreshToken, token, ...rest} = result;

        tokenUtiles.setAccessTokenCookie(res, accessToken);
        tokenUtiles.setRefreshTokenCookie(res, refreshToken);
        tokenUtiles.setBetterAuthSessionCookie(res, token);

        sendReponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User login successful!",
            data: {
                ...rest,
                token,
                accessToken,
                refreshToken,                
            },            
        })
    }
)



const getMe = catchAsync(
    async(req:Request, res:Response) => {

        const user = req.user;
        const result = await AuthService.getMe(user)

        sendReponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User profile fetched successfully!",
            data: result            
        })
    }
);




const getNewToken = catchAsync(async (req:Request, res:Response) => {

    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];

    if(!refreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Refresh-Token is missing!")
    }

    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

    const {accessToken, refreshToken:newAccessToken, sessionToken} = result;
    tokenUtiles.setAccessTokenCookie(res, accessToken);
    tokenUtiles.setRefreshTokenCookie(res, newAccessToken);
    tokenUtiles.setBetterAuthSessionCookie(res, sessionToken);


    sendReponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile fetched successfully!",
        data: {
            accessToken,
            refreshToken,
            sessionToken
        }            
        })
})


export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken
}