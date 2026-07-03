/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { SpecialityController } from "./Speciality.controller";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', SpecialityController.createSpeciality)

router.get('/', checkAuth(Role.ADMIN, Role.DOCTOR), SpecialityController.getAllSpecialities)

router.delete('/:id', SpecialityController.deleteSpeciality)







export const SpecialityRoute = router;