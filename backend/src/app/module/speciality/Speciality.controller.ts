import { Request, Response } from "express";
import { SpecialityService } from "./Speciality.service";

const createSpeciality = async (req:Request, res:Response) => {
    const payload = req.body;
    console.log('this is payload:', payload);

    const result = await SpecialityService.createSpeciality(payload)

    res.status(200).json({
        success: true,
        message: "Speciality Added✅",
        data:result
    })

}


export const SpecialityController = {
    createSpeciality
}