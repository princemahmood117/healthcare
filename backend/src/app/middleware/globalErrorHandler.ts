/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVerse } from "../../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";




export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (envVerse.NODE_ENV === "development") {
    console.log("error from global error handler:", err);
  }


// this is error source for zod error
  let errorSource : TErrorSources[] = [] 

  let statusCode : number = status.INTERNAL_SERVER_ERROR;
  let message : string = "Internal Server Error!"


  // zod error 
  if(err instanceof z.ZodError) {

    const simplifiedError = handleZodError(err)

    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  
    errorSource = [...simplifiedError.errorSource!]

  }


  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSource,
    error: envVerse.NODE_ENV === 'development' ? err : undefined    
  }

  res.status(statusCode).json(errorResponse);

};
