const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const RESET_TOKEN_EXPIRES_IN_MINUTES = 15;

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
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

const registerUser = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const { name, email, password } = req.body;
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
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: sanitizeUser(user),
      token: generateToken(user._id),
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is disabled");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: sanitizeUser(user),
      token: generateToken(user._id),
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const normalizedEmail = req.body.email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  const responseMessage = "If an account exists, password reset instructions have been generated";

  if (!user || !user.isActive) {
    return res.status(200).json({
      success: true,
      message: responseMessage,
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);

  await User.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    }
  );

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/reset-password/${resetToken}`;

  res.status(200).json({
    success: true,
    message: responseMessage,
    data: process.env.NODE_ENV === "production" ? undefined : {
      resetToken,
      resetUrl,
      expiresInMinutes: RESET_TOKEN_EXPIRES_IN_MINUTES,
    },
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const tokenRecord = await User.collection.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!tokenRecord) {
    res.status(400);
    throw new Error("Password reset token is invalid or expired");
  }

  const user = await User.findById(tokenRecord._id).select("+password");

  if (!user || !user.isActive) {
    res.status(400);
    throw new Error("Password reset token is invalid or expired");
  }

  user.password = req.body.password;
  await user.save();

  await User.collection.updateOne(
    { _id: user._id },
    {
      $unset: {
        passwordResetToken: "",
        passwordResetExpires: "",
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
