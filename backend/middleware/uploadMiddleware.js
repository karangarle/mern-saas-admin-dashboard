const path = require("path");
const fs = require("fs");
const multer = require("multer");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads", "profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user-${req.user?._id || "unknown"}-${uniqueSuffix}${ext}`);
  },
});

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
