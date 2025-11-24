const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authLogger } = require("../middleware/loggingMiddleware");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const formatAddress = (address = {}) => ({
  street: address.street || "",
  city: address.city || "",
  state: address.state || "",
  zip: address.zip || "",
  country: address.country || "",
});

const buildUserResponse = (user, includeToken = true) => {
  const response = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    phone: user.phone || "",
    address: formatAddress(user.address),
  };

  if (includeToken) {
    response.token = generateToken(user._id);
  }

  return response;
};

const extractAddressUpdates = (body) => {
  const updates = {};
  const nestedAddress =
    typeof body.address === "object" && body.address !== null
      ? body.address
      : undefined;

  if (typeof body.address === "string") {
    updates.street = body.address;
  }

  ["street", "city", "state", "zip", "country"].forEach((field) => {
    if (nestedAddress && nestedAddress[field] !== undefined) {
      updates[field] = nestedAddress[field];
    }
  });

  ["city", "state", "zip", "country"].forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      authLogger("FAILED_REGISTER", "NEW", email, "User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (user) {
      authLogger("REGISTER_SUCCESS", user._id, email);
      res.status(201).json({
        success: true,
        user: buildUserResponse(user),
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      authLogger("LOGIN_SUCCESS", user._id, email);
      res.json({
        success: true,
        user: buildUserResponse(user),
      });
    } else {
      authLogger("FAILED_LOGIN", "UNKNOWN", email, "Invalid credentials");
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      const addressUpdates = extractAddressUpdates(req.body);
      if (Object.keys(addressUpdates).length > 0) {
        user.address = {
          ...user.address?.toObject?.(),
          ...user.address,
          ...addressUpdates,
        };
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: buildUserResponse(updatedUser),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
