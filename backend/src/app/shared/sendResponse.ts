
import { Response } from "express";


interface IResponseData <T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T; // T type is set in 'data'
  meta ?:  {
    page : number;
    limit : number;
    total : number;
    totalPages : number;
  }
}



export const sendReponse = <T>(res:Response, responseData:IResponseData<T>) => {
  const {httpStatusCode, success, message, data, meta} = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  })
}