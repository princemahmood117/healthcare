import { Request, Response } from "express";
import { SpecialityService } from "./Speciality.service";

// creaye speciality
const createSpeciality = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
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
const getAllSpecialities = async (req: Request, res: Response) => {
  try {
    const result = await SpecialityService.getAllSpecialities();

    res.status(201).json({
      success: true,
      message: "fetched all specialities",
      data: result,
    });
  } catch (error) {
    console.log("error from getAllSpeciality:", error);
  }
};


// delete specility
const deleteSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("to be deleted:", id);
    const result = await SpecialityService.deleteSpeciality(id as string);
    
    res.status(200).json({
      success: true,
      message: `deleted speciality id: ${id}`,
      data: result,
    });
  } catch (error) {
    console.log("error from deleteSpeciality:", error);
  }
};


export const SpecialityController = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
