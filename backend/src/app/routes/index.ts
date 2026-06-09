import { Router } from "express";
import { SpecialityRoute } from "../module/speciality/Speciality.route";

const router = Router()

// when found '/specialities' route, it will go to "SpecialityRoute"

router.use('/specialities', SpecialityRoute)

export const IndexRoutes = router;