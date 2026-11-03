import { Prisma } from "../../../generated/prisma/client";


export const doctorSearchableFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specialities.speciality.title'];


export const doctorFilterableFields = ['gender', 'isDeleted', 'appointmentFee', 'experience', 'registrationNumber', 'currentWorkingPlace', 'specialities.specialityId', 'designation', 'specialities.speciality.title', 'qualification', 'user.role'];


export const doctorIncludeConfig : Partial<Record <keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {

    user : true,

    specialities : {
        include : {
            speciality : true,
        }
    },
    
    appointments : {
        include : {
            patient : true,
            doctor : true,
            prescription : true,            
        }
    },

    doctorSchedules : {
        include : {
            schedule : true,
        }
    },

    prescriptions : true,

    reviews : true,


    
}