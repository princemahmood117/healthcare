import { Router } from "express";
import { SpecialityController } from "./Speciality.controller";

const router = Router()

router.post('/', SpecialityController.createSpeciality)
router.get('/', SpecialityController.getAllSpecialities)






export const SpecialityRoute = router;