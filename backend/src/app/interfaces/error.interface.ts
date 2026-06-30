export interface TErrorResponse {
    success: boolean,
    message: string,
    errorSource?: TErrorSources[]
    error?: unknown
}


export interface TErrorSources {
  path: string;
  message: string
}