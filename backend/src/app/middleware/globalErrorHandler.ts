/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVerse } from "../../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudninary } from "../../config/cloudinaryConfig";




export const globalErrorHandler = async(err: Error, req: Request, res: Response, next: NextFunction) => {

  if (envVerse.NODE_ENV === "development") {
    console.log("error from global error handler:", err);
  }

  // for single file
  if(req.file) {
    await deleteFileFromCloudninary(req.file?.path)
  }

  // for multiple files
  if(req.files &&  Array.isArray(req.files) && req.files.length > 0) {

    const imageUrls = req.files.map((file) => file.path)  // gives the file paths array

    await Promise.all(imageUrls.map((url) => deleteFileFromCloudninary(url)))
  }

  
  // default error values
  let statusCode : number = status.INTERNAL_SERVER_ERROR;
  let message : string = "Internal Server Error!"

// this is error source for zod error
  let errorSource : TErrorSources[] = [] 

  let stack : string|undefined = undefined;


  // zod error handle
  if(err instanceof z.ZodError) {

    const simplifiedError = handleZodError(err)

    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  
    errorSource = [...simplifiedError.errorSource!]

  } else if (err instanceof AppError){
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSource = [{
      path: "",
      message: err.message
    }]
  }
  
  // javascript native error handle
  else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;    
    errorSource = [{
      path: "",
      message: err.message
    }]
  }


  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSource,
    stack: envVerse.NODE_ENV === 'development' ? stack : undefined,
    error: envVerse.NODE_ENV === 'development' ? err : undefined    
  }

  res.status(statusCode).json(errorResponse);

};
