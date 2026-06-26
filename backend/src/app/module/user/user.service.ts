import { Role, Speciality } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";



const createDoctor = async (payload:ICreateDoctorPayload) => {

    // all specialities will have their own ID which will be sent in array while creating doctor 
    const specialities : Speciality[] = [];

    for(const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        });

        if(!speciality) {
            throw new Error(`Speciality ${specialityId} not found!`)
        }
        specialities.push(speciality)
    };


    const userExist = await prisma.user.findUnique({
        where : {
            email: payload?.doctor?.email
        }
    }) 

    if(userExist) {
        throw new Error(`User with this email already exists!`)
    }



    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true,

        }
    });


    // TRANSACTION part
    try {
        // 
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                }
            });

            const doctorSpecialityData = specialities.map((speciality) => {
                return {
                    doctorId: doctorData.id,
                    specialityId: speciality.id
                }
            });
            
            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityData
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    createdAt:true,
                    updatedAt: true,
                    currentWorkingPLace: true,
                    designation: true,
                    user : {
                        select : {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                            deletedAt: true,
                            isDeleted: true,
                        }
                    },
                    specialities : {
                        select: {
                            speciality : {
                                select : {
                                    title: true,
                                    id: true,
                                }
                            }
                        }
                    }


                }
            })

            return doctor;
            
        })
        return result;

    } catch (error) {
        console.log('transaction error from doctor creation:', error);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
    }






    

}





export const userService = {
    createDoctor
}