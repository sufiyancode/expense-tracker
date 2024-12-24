const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return next(new ApiError("Unauthorized, invalid token", 401));
    }
  } else {
    return next(new ApiError("Unauthorized, no token provided", 401));
  }
};

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(new ApiError("You don't have access to this route", 403));
    }
    return next();
  };
  return checkPermission;
};

module.exports = { protect, restrictTo };
