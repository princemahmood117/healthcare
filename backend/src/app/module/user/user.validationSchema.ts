import * as z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({

  password: z.string("Password is required!").min(6,"minimum 6 characters").max(20, "maximum 5 characters"),

  doctor: z.object({
    name: z.string("Name is required!").min(5, "minimum 5 characters").max(50, "Maximum 50 characters"),

    email: z.email(),

    contactNumber: z.string("Required!").min(11).max(14),

    address: z.string().min(10).max(100).optional(),

    registrationNumber: z.string(),

    experience: z.int('required').nonnegative('must be 0 or positive value'),

    gender: z.enum([Gender.MALE, Gender.FEMALE]),

    appointmentFee: z.number('must be number').nonnegative('cannot be negative value!'),

    qualification: z.string('qualification must be string').min(2).max(60),

    currentWorkingPLace: z.string('current working place must be string').min(10).max(60),

    designation: z.string('designation must be string').min(5).max(100),

  }),

    specialities: z.array(z.uuid()).min(1, "atleast one speciality is required!"),
});