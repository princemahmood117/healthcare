

import { CookieOptions, Request, Response } from "express";



// set cookie with the response from server  (browser <-- server)

// when server sends a response to browser, it tells to set the cookie

const setCookie = (res:Response, key:string, value:string, options:CookieOptions) => {

    res.cookie(key, value, options)
}




// get cookie from the frontend request  (browser --> server)

// when browser sends request to the server, it send the cookie with the request

const getCookie = (req:Request, key:string) => {

    return req.cookies[key]
}



const clearCookie = (res:Response, key:string, options:CookieOptions) => {

    res.clearCookie(key, options)

}



export const cookieUtils = {
    setCookie,
    getCookie,
    clearCookie
}