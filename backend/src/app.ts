import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVerse } from "./config/env";



const app:Application = express(); 



app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))

app.use(cors({
  origin : [envVerse.FRONTEND_URL, envVerse.BETTER_AUTH_URL, "https://localhost:3000", "https://localhost:5000"],
  credentials : true,
  methods : ["GET", "PUT", "PATCH", "DELETE", "UPDATE"],
  allowedHeaders : ["Content-Type", "Authorization"]
}))


app.use("/api/auth", toNodeHandler(auth))


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.use(express.urlencoded({extended : true}))


app.use('/api/v1', IndexRoutes)



// GLOBAL ERROR HANDLER
app.use(globalErrorHandler)
app.use(notFound)






// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});



export default app;