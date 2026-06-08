import { Speciality } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

// :Promise<Speciality> -> This async function returns a Speciality object

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    
    const speciality = await prisma.speciality.create({
        data: payload
    })

    return speciality

}


export const SpecialityService = {
    createSpeciality
}