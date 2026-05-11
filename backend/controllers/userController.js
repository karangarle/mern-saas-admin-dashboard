const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const allowedRoles = ["admin", "manager", "user"];

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

  if (search) {
    query.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
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
  const sort = req.query.sort || "-createdAt";
  const query = buildUserQuery(req.query);

  const [users, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
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

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: { id: req.params.id },
  });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
