import { Router } from "express";
import { SpecialityController } from "./Speciality.controller";

const router = Router()

router.post('/', SpecialityController.createSpeciality)

router.get('/', SpecialityController.getAllSpecialities)

router.delete('/:id', SpecialityController.deleteSpeciality)







export const SpecialityRoute = router;