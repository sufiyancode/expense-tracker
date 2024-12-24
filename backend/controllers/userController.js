const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");

// Register a new user
const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, userType, phone } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User already exists", 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    userType,
    phone,
  });

  const userdetails = await User.findOne({ email });
  if (!userdetails) {
    return next(new ApiError("User not registeration failed", 404));
  }
  // Generate a token
  const token = jwt.sign(
    { id: userdetails._id, userType: userdetails.userType },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    token,
  });
});

// Login a user
const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid credentials", 401));
  }

  // Generate a token
  const token = jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    token,
  });
});

// Get user profile
const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.json(user);
});

// Update user profile
const updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  user.name = name || user.name;
  // user.email = email || user.email;
  user.phone = phone || user.phone;

  const updatedUser = await user.save();

  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    userType: updatedUser.userType,
  });
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
