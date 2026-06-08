import { Router } from "express";
import { SpecialityController } from "./Speciality.controller";

const router = Router()

router.post('/specialities', SpecialityController.createSpeciality)

export const SpecialityRoute = router;