import {  Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validationSchema";


const router = Router();


router.post("/create-doctor", validateRequest(createDoctorZodSchema) ,userController.createDoctor);

export const UserRoutes = router;
