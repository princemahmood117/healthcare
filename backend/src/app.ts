import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";


const app:Application = express(); 

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())


app.use('/api/v1', IndexRoutes)



// GLOBAL ERROR HANDLER
app.use(globalErrorHandler)
app.use(notFound)


















// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});



export default app;