import { prisma } from "../../lib/prisma"

const getAllDoctors = async () => {

    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    })

    return doctors
}


const getDoctorByID = async (id:string) => {

    const doctor = await prisma.doctor.findUnique({
        where: {
            id:id,
            isDeleted: false,
        },
        include: {
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return doctor

} 



export const doctorService = {
    getAllDoctors,
    getDoctorByID
}