const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
} = require("../middleware/validationMiddleware");

router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validateUserProfileUpdate, updateUserProfile);

module.exports = router;
