import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendReponse } from "../../shared/sendResponse";
import status from "http-status";
import { ScheduleService } from "./schedule.service";




const createSchedule = catchAsync(async (req : Request, res : Response) => {

    const schedule = await ScheduleService.createSchedule();

    sendReponse(res, {

        success : true,
        httpStatusCode : status.OK,
        message : "Schedule created Successfully!",
        data : schedule
    })
});



const getAllSchedule = catchAsync(async (req : Request, res : Response) => {

    const schedules = await ScheduleService.getAllSchedule();

    sendReponse(res, {

        success : true,
        httpStatusCode : status.OK,
        message : "All Schedules received Successfully!",
        data : schedules
    })
});



const getScheduleByID = catchAsync(async (req : Request, res : Response) => {

    const schedule = await ScheduleService.getScheduleByID();

    sendReponse(res, {

        success : true,
        httpStatusCode : status.OK,
        message : "Schedule received Successfully!",
        data : schedule
    })
});





const updateSchedule = catchAsync(async (req : Request, res : Response) => {

    sendReponse(res, {

        success : true,
        httpStatusCode : status.OK,
        message : "Schedule updated Successfully!",
        data : updateSchedule
    })
});



const deleteSchedule = catchAsync(async (req : Request, res : Response) => {

    await ScheduleService.deleteSchedule();

    sendReponse(res, {

        success : true,
        httpStatusCode : status.OK,
        message : "Schedule deleted Successfully!",
        
    })
});


export const ScheduleController = {

    createSchedule,
    getAllSchedule,
    getScheduleByID,
    updateSchedule,
    deleteSchedule

}