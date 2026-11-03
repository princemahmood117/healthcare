import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";

const getAllDoctors = catchAsync(async (req:Request,res:Response) => {
    
    const query = req.query;


    const result = await doctorService.getAllDoctors(query as IQueryParams)
    
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


const updateDoctor = catchAsync(async(req:Request, res:Response) => {

    const {id} = req.params;
    const payload = req.body;

    const updateDoctor = await doctorService.updateDoctor(id as string, payload);

    sendReponse(res,{
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor updated",
        data: updateDoctor
    })

})


const deleteDoctor = catchAsync(async(req:Request, res:Response) => {

    const {id} = req.params;

    const result = await doctorService.deleteDoctor(id as string)

    sendReponse(res,{
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor updated",
        data: result
    })

})


export const doctorController = {
    getAllDoctors,
    getDoctorByID,
    updateDoctor,
    deleteDoctor
}