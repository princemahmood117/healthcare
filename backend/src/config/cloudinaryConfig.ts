import {v2 as cloudinary, UploadApiResponse} from "cloudinary";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})




// file upload manually if needed
export const uploadFileToCloudinary = async (buffer : Buffer, fileName: string) : Promise<UploadApiResponse> => {

    if(!buffer || !fileName) {
        throw new AppError(status.BAD_REQUEST, "File buffer and file name are required!")        
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    // eslint-disable-next-line no-useless-escape
    const fileNameWithoutExtension = fileName.split(".").slice(0,-1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")

    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + fileNameWithoutExtension;


    const folder = extension === "pdf" ? "pdfs" : "images";

        return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type : "auto",
                    public_id : `healthCare/${folder}/${uniqueName}`,
                    folder : `healthCare/${folder}`,
                },
                (error, result) => {
                    if(error) {
                        return reject(new AppError(status.INTERNAL_SERVER_ERROR, "failed to manually upload image to cloudinary"))
                    }
                    resolve(result as UploadApiResponse)
                }
            ).end(buffer)
            })

}





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