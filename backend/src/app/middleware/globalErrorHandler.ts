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

  }
  
  // javascript native error handle
  else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;    
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
