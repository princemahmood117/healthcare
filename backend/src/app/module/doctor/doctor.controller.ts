import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req:Request,res:Response) => {
    const result = await doctorService.getAllDoctors()
    
    sendReponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctors fetched successfully!",
        data: result
    })
})


const getDoctorByID = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params;

    const result = await doctorService.getDoctorByID(id as string);

    sendReponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `doctor ${id} fetched successfully!`,
        data: result
    })
})


export const doctorController = {
    getAllDoctors,
    getDoctorByID
}