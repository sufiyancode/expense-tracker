const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");

const connectDB = catchAsync(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error at MongodB: " + error);
  }
});

module.exports = connectDB;
