const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const globalErrorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const transactions = require("./routes/transactions");
const ApiError = require("./utils/apiError");
const catchAsync = require("./utils/catchAsync");

dotenv.config();

if (!process.env.PORT) {
  console.error("PORT environment variable is not set!");
  process.exit(1);
}

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(
  cors({
    origin: [
      "https://expense-frotend.vercel.app",
      "https://deploy-mern-1whq.vercel.app",
      "http://localhost:5173",
      "https://expense-tracker-mu-sage-83.vercel.app",
    ],
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json("Hello from Expense Tracker");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactions);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new ApiError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
