/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { SpecialityController } from "./Speciality.controller";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multerConfig";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validation";

const router = Router()

router.post('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validateRequest(SpecialityValidation.createSpecialityZodSchema), SpecialityController.createSpeciality)

router.get('/', checkAuth(Role.ADMIN, Role.DOCTOR), SpecialityController.getAllSpecialities)

router.delete('/:id', SpecialityController.deleteSpeciality)







export const SpecialityRoute = router;