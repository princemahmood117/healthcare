import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;

    const result = await userService.createDoctor(payload)

    sendReponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Doctor registered successfully!",
        data: result
    })
})


export const userController = {
    createDoctor
}