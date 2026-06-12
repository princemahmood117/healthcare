/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from "express";
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
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      success:false,
      message: "Failed to create speciality",
      error: error.message
    })
  }
};


const catchAsync = (fn:RequestHandler) => {
  return async (req:Request, res:Response, next:NextFunction) => {

    try {
      await fn(req,res,next);
    } catch (error:any) {
      console.log(error);
      res.status(500).json({
      success:false,
      message: "Failed to fetch all specialities",
      error: error.message
    })
  }
  }
}


// get all specialities using function call
const getAllSpecialities = async (req: Request, res: Response) => {
  
};





// get all specialities
// const getAllSpecialities = async (req: Request, res: Response) => {
//   try {
//     const result = await SpecialityService.getAllSpecialities();

//     res.status(201).json({
//       success: true,
//       message: "fetched all specialities",
//       data: result,
//     });
//   } catch (error:any) {
//     console.log(error);
//     res.status(500).json({
//       success:false,
//       message: "Failed to fetch all specialities",
//       error: error.message
//     })
//   }
// };


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
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      success:false,
      message: "Failed to delete speciality",
      error: error.message
    })
  }
};


export const SpecialityController = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
