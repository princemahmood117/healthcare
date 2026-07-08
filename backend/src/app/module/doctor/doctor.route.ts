import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router()

router.get('/', doctorController.getAllDoctors)

router.get('/:id', doctorController.getDoctorByID)

router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDoctorZodSchema) ,doctorController.updateDoctor)


router.delete('/:id',checkAuth(Role.ADMIN, Role.SUPER_ADMIN) ,doctorController.deleteDoctor)

export const DoctorRoutes = router;