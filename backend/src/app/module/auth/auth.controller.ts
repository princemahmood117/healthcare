import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendReponse } from "../../shared/sendResponse";

const registerPatient = catchAsync(
    async(req:Request, res:Response) => {
        const payload = req.body;   
        
        console.log("payload: ", payload);
        const result = await AuthService.registerPatient(payload)

        console.log('result:', result);

        sendReponse(res,  {
            httpStatusCode: 201,
            success:true,
            message: "Patient registered successfully!",
            data: result
        })
    }
)


const loginUser = catchAsync(
    async (req:Request, res:Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload)
        sendReponse(res, {
            httpStatusCode:200,
            success: true,
            message: "User login successful!",
            data: result
        })
    }
)


export const AuthController = {
    registerPatient,
    loginUser
}