import {v2 as cloudinary} from "cloudinary";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})


export const deleteFileFromCloudninary = async(url : string) => {

try {

    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);
    console.log('match : ', match);

    if(match && match[1]) {
        const public_id = match[1];
        await cloudinary.uploader.destroy(public_id, {
            resource_type : "image"
        })
        console.log(`file ${public_id} deleted from cloudnary!`);

    }
} 

catch (error) {
    console.error(`Eror deleting file from cloudinary!`, error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "App Error : Failed to delete file from cloudinary")
}

} 


export const cloudinaryUpload = cloudinary;