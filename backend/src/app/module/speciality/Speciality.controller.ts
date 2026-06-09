import { Request, Response } from "express";
import { SpecialityService } from "./Speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log("this is payload:", payload);

    const result = await SpecialityService.createSpeciality(payload);

    res.status(200).json({
      success: true,
      message: "Speciality Added✅",
      data: result,
    });
  } catch (error) {
    console.log("error from createSpeciality:", error);
  }
};

// get all specialities

const getAllSpecialities = async (req:Request,res:Response) => {
  try {
    const result = await SpecialityService.getAllSpecialities();

    res.status(201).json({
      success: true,
      message: "fetched all specialities",
      data: result,
    });
  } catch (error) {
    console.log("error from createSpeciality:", error);
  }
};

export const SpecialityController = {
  createSpeciality,
  getAllSpecialities
};
