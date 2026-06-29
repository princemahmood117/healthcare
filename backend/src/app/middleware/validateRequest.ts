import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const parsedResult = zodSchema.safeParse(req.body)

    if(!parsedResult.success) {
      next(parsedResult.error)
    }

    // sanitizing the data by removing invalid fields
    req.body = parsedResult.data;
    next();
  }
}