import express, { Application, Request, Response } from "express";

import dotenv from 'dotenv';
import { prisma } from "./app/lib/prisma";
dotenv.config();

const app:Application = express(); 

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());


app.get('/', async(req: Request, res: Response) => {
  const speciality = await prisma.speciality.create({
    data: {
      title: "Cardiology"
    }
  })
  res.status(201).json({
    success:true,
    message: "api working",
    data: speciality
  });
});


// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});



export default app;