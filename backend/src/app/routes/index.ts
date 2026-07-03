import { Router } from "express";
import { SpecialityRoute } from "../module/speciality/Speciality.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router()

// when found '/specialities' route, it will go to "SpecialityRoute"

router.use("/auth", AuthRoutes)

router.use('/specialities', SpecialityRoute)

router.use('/users', UserRoutes)

router.use('/doctors', DoctorRoutes)

router.use('/admin', AdminRoutes)

export const IndexRoutes = router;