import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtiles } from "../../utils/token";

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
        console.log('result:', result);

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


export const AuthController = {
    registerPatient,
    loginUser
}