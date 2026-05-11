const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN SaaS Admin Dashboard API",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
