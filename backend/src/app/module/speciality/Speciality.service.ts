import { Speciality } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

// :Promise<Speciality> -> This async function returns a Speciality object

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    
    const speciality = await prisma.speciality.create({
        data: payload
    })
    return speciality

}



const getAllSpecialities = async () => {
    const specialities = await prisma.speciality.findMany()

    return specialities
}


const  deleteSpeciality = async (id:string) => {

    const deleteSpeciality = await prisma.speciality.delete({
        where: {
            id:id as string
        }
    })
    return deleteSpeciality;
}




export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality
}