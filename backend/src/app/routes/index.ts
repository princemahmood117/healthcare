import { Router } from "express";
import { SpecialityRoute } from "../module/speciality/Speciality.route";

const router = Router()

router.use('/specialities', SpecialityRoute)

export const IndexRoutes = router;