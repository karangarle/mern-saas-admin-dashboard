const express = require("express");
const { body, param } = require("express-validator");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must include uppercase, lowercase, number, and symbol"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

const resetPasswordValidation = [
  param("token")
    .trim()
    .isLength({ min: 64, max: 64 })
    .withMessage("Valid reset token is required")
    .isHexadecimal()
    .withMessage("Valid reset token is required"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must include uppercase, lowercase, number, and symbol"),
];

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.patch("/reset-password/:token", resetPasswordValidation, resetPassword);

module.exports = router;
