import { Speciality } from "../../../generated/prisma/client";
import { ICreateDoctorPayload } from "./user.interface";



const createDoctor = async (payload:ICreateDoctorPayload) => {

    // all specialities will have their own ID which will be sent in array while creatind doctor 
    const specialities :Speciality[] = [];
    

}





export const doctorService = {
    createDoctor
}