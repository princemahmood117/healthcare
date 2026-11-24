import { Router } from "express";
import { SpecialityRoute } from "../module/speciality/Speciality.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { ScheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoute } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";

const router = Router()

// when found '/specialities' route, it will go to "SpecialityRoute"

router.use("/auth", AuthRoutes)

router.use('/specialities', SpecialityRoute)

router.use('/users', UserRoutes)

router.use('/doctors', DoctorRoutes)

router.use('/admin', AdminRoutes)

router.use('/schedule', ScheduleRoutes)

router.use('/doctorSchedule', DoctorScheduleRoute)

router.use('/appointment', AppointmentRoutes)

export const IndexRoutes = router;