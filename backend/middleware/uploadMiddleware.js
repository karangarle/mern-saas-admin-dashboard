const path = require("path");
const multer = require("multer");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
    return callback(new Error("Only JPG, PNG, and WEBP images are allowed"));
  }

  return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadProfileImage = upload.single("profileImage");

module.exports = {
  uploadProfileImage,
};
