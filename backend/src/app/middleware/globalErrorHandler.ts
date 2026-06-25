/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVerse } from "../../config/env";
import status from "http-status";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVerse.NODE_ENV === "development") {
    console.log("error from global error handler:", err);
  }

  const statusCode : number = status.INTERNAL_SERVER_ERROR;
  const message : string = "Internal Server Error!"


  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};
