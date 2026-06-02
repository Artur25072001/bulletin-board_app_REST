import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { unlink } from "fs/promises";
import logger from "../services/logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });
const uploadImage = async (file) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file.path);
    return secure_url;
  } finally {
    await unlink(file.path).catch((err) =>
      logger.warn(`Failed to delete temp file ${file.path}: ${err.message}`),
    );
  }
};

export { upload, cloudinary, uploadImage };
