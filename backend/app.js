const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const globalErrorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const ApiError = require("./utils/apiError");
const catchAsync = require("./utils/catchAsync");
const transactions = require("./routes/transactions");

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(
  cors({
    origin: [
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

app.get("/", (req, res) => {
  res.json("Hello");
});
// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactions);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new ApiError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);
// Error Middleware
app.use(globalErrorHandler);

module.exports = app;
