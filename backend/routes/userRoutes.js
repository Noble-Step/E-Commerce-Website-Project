const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
} = require("../middleware/validationMiddleware");

router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validateUserProfileUpdate, updateUserProfile);
// Admin: list all users
router.get("/", protect, admin, getAllUsers);

module.exports = router;
