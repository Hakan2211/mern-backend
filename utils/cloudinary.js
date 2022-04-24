import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload, folder) => {
  try {
    const data = await cloudinary.v2.uploader.upload(fileToUpload, {
      resource_type: "auto",
      folder: folder,
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

export default cloudinaryUploadImg;
