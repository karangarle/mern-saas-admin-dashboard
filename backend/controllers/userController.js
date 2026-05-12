const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { deleteImage, uploadImageBuffer } = require("../utils/cloudinary");

const allowedRoles = ["admin", "manager", "user"];
const allowedSorts = new Set(["createdAt", "-createdAt", "name", "-name", "email", "-email"]);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  profileImage: user.profileImage || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.errors = errors.array().map((item) => ({
      field: item.path,
      message: item.msg,
    }));
    res.status(400);
    throw error;
  }
};

const buildUserQuery = ({ search, role, status }) => {
  const query = {};
  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    const safeSearch = escapeRegex(trimmedSearch);

    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (role && allowedRoles.includes(role)) {
    query.role = role;
  }

  if (status === "active") {
    query.isActive = true;
  }

  if (status === "inactive") {
    query.isActive = false;
  }

  return query;
};

const getUsers = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sort = allowedSorts.has(req.query.sort) ? req.query.sort : "-createdAt";
  const query = buildUserQuery(req.query);
  const projection = "name email role isActive profileImage createdAt updatedAt";

  const [users, total] = await Promise.all([
    User.find(query)
      .select(projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);
  const totalPages = Math.ceil(total / limit) || 1;

  res.status(200).json({
    success: true,
    data: {
      users: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        search: req.query.search?.trim() || "",
        role: req.query.role || "",
        status: req.query.status || "",
      },
    },
  });
});

const createUser = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const { name, email, password, role = "user", isActive = true } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: { user: sanitizeUser(user) },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const updates = {};
  const allowedFields = ["name", "email", "role", "isActive"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = field === "email" ? req.body[field].toLowerCase().trim() : req.body[field];
    }
  });

  if (updates.email) {
    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already in use");
    }
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: { user: sanitizeUser(user) },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  if (req.user?._id?.toString() === req.params.id) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete local image if exists
  if (user.profileImage?.publicId?.startsWith("local-")) {
    const filePath = path.join(process.cwd(), "uploads", "profiles", user.profileImage.publicId.replace("local-", ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: { id: req.params.id },
  });
});

const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Profile image is required");
  }

  const userId = req.user?._id;
  if (!userId) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  let profileImage = {};

  // Check if Cloudinary is configured
  const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    // Cloudinary Upload
    try {
      // For local disk storage, we need to read the file into a buffer if we want to use the buffer uploader, 
      // or just upload the file path. Since I switched to diskStorage, I'll use the file path.
      const result = await uploadImageBuffer(fs.readFileSync(req.file.path), {
        public_id: `user-${userId}-${Date.now()}`,
        overwrite: true,
      });

      if (currentUser.profileImage?.publicId && !currentUser.profileImage.publicId.startsWith("local-")) {
        await deleteImage(currentUser.profileImage.publicId);
      }

      profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        updatedAt: new Date(),
      };

      // Clean up local temp file after Cloudinary upload
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to local:", error.message);
      // Fallback to local if Cloudinary fails
      profileImage = {
        url: `/uploads/profiles/${req.file.filename}`,
        publicId: `local-${req.file.filename}`,
        updatedAt: new Date(),
      };
    }
  } else {
    // Local Storage only
    // Delete old local file if it exists
    if (currentUser.profileImage?.publicId?.startsWith("local-")) {
      const oldPath = path.join(process.cwd(), "uploads", "profiles", currentUser.profileImage.publicId.replace("local-", ""));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    profileImage = {
      url: `/uploads/profiles/${req.file.filename}`,
      publicId: `local-${req.file.filename}`,
      updatedAt: new Date(),
    };
  }

  await User.findByIdAndUpdate(userId, {
    $set: { profileImage },
  });

  const updatedUser = await User.findById(userId);

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    data: {
      user: sanitizeUser(updatedUser),
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const { name, email } = req.body;
  const userId = req.user._id;

  const updates = {};
  if (name) updates.name = name;
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ 
      email: normalizedEmail, 
      _id: { $ne: userId } 
    });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already in use");
    }
    updates.email = normalizedEmail;
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: sanitizeUser(user) },
  });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfileImage,
  updateProfile,
};
