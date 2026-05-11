const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const assertCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not configured");
  }
};

const uploadImageBuffer = (buffer, options = {}) => {
  assertCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mern-saas-admin-dashboard/profiles",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          { width: 512, height: 512, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteImage = async (publicId) => {
  assertCloudinaryConfig();

  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

module.exports = {
  uploadImageBuffer,
  deleteImage,
};
