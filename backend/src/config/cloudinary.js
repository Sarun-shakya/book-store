import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_SECRET_KEY) {
    console.error("Cloudinary environment variables are missing!");
    process.exit(1); 
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // root folder
        });

        console.log("File uploaded on Cloudinary:", response.secure_url);

        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

        return {
            url: response.secure_url,
            public_id: response.public_id
        };
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteOnCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });

        console.log("Cloudinary delete result:", result);  
        return result;
    } catch (error) {
        return error;
        console.log("delete on cloudinary failed", error);
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };

