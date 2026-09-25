import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.Cloud_NAME,
      api_key: process.env.Cloud_API_KEY,
      api_secret: process.env.Cloud_API_SECRET,
    });
  },
};