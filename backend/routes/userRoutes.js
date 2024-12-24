const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes (to be implemented with authentication middleware)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, restrictTo("user", "admin"), updateUserProfile);

module.exports = router;
