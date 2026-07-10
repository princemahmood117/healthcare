/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVerse } from "../../config/env";

export const checkAuth = (...authRoles: Role[]) => async (req:Request, res:Response, next:NextFunction) => {
     try {

        // get the sesssion
        const sessionToken = cookieUtils.getCookie(req,'better-auth.session_token');

        if(!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "unauthorized from middleware, no session found!")
        }

        // check if the session exists in database
        if(sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true,   // pulls the related user record
                }
                
            })

            if(sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();

                const expiresAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime()

                const timeRemaining = expiresAt.getTime() - now.getTime();

                const parcentRemainig = (timeRemaining - sessionLifeTime) / 100;

                if(parcentRemainig < 20) {
                    res.setHeader("X-Session-Refresh", 'true');
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", timeRemaining.toString());

                    console.log("Session expiring soon:");
                }

                if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, 'user is not active!')
                } 
                if(user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, 'user is deleted!')
                }

                if(authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, 'Forbidden access!')
                }

            }


            // access toke
            const accessToken = cookieUtils.getCookie(req, 'accessToken');

            if(!accessToken) {
                throw new AppError(status.UNAUTHORIZED, 'access token not found!')
            }

        }

        const accessToken = cookieUtils.getCookie(req, "accessToken");
        if(!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!')
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVerse.ACCESS_TOKEN_SECRET)

        if(!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!')
        }

        if(authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden! Role not matched')
        }
        next()
        
     } catch (error:any) {
        next(error)
     }
}


// understanding the checkAuth middleware