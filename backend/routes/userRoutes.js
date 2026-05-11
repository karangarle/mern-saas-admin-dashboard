const express = require("express");
const { body, param, query } = require("express-validator");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const objectIdValidation = [
  param("id").isMongoId().withMessage("Valid user id is required"),
];

const listValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("role").optional().isIn(["admin", "manager", "user"]).withMessage("Invalid role filter"),
  query("status").optional().isIn(["active", "inactive"]).withMessage("Invalid status filter"),
  query("search").optional().trim().isLength({ max: 80 }).withMessage("Search cannot exceed 80 characters"),
];

const createValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must include uppercase, lowercase, number, and symbol"),
  body("role").optional().isIn(["admin", "manager", "user"]).withMessage("Invalid role"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
];

const updateValidation = [
  ...objectIdValidation,
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email").optional().trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("role").optional().isIn(["admin", "manager", "user"]).withMessage("Invalid role"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
];

router
  .route("/")
  .get(protect, authorize("admin", "manager"), listValidation, getUsers)
  .post(protect, authorize("admin"), createValidation, createUser);

router
  .route("/:id")
  .patch(protect, authorize("admin"), updateValidation, updateUser)
  .delete(protect, authorize("admin"), objectIdValidation, deleteUser);

module.exports = router;
