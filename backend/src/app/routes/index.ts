import { Router } from "express";
import { SpecialityRoute } from "../module/speciality/Speciality.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";

const router = Router()

// when found '/specialities' route, it will go to "SpecialityRoute"

router.use("/auth", AuthRoutes)

router.use('/specialities', SpecialityRoute)

router.use('/doctors', UserRoutes)

export const IndexRoutes = router;