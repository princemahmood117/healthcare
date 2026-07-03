import {  Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validationSchema";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();


router.post("/create-doctor", validateRequest(createDoctorZodSchema) ,userController.createDoctor);



router.post('/create-admin', checkAuth(Role.ADMIN, Role.SUPER_ADMIN) ,userController.createAdmin)

export const UserRoutes = router;
