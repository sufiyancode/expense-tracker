const Transaction = require("../models/Transaction");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");

// Get all transactions for a specific user
exports.getTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// Add a new transaction
exports.addTransaction = catchAsync(async (req, res, next) => {
  const { text, amount } = req.body;

  if (!text || !amount) {
    return next(new ApiError("Both text and amount are required", 400));
  }

  if (typeof amount !== "number") {
    return next(new ApiError("Amount must be a number", 400));
  }

  const transaction = await Transaction.create({
    text,
    amount,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

// Update a transaction
exports.updateTransaction = catchAsync(async (req, res, next) => {
  const { text, amount } = req.body;
  const { id } = req.params;

  if (!text && (amount === undefined || amount === null)) {
    return next(
      new ApiError("At least one field (text or amount) must be provided", 400)
    );
  }
  if (amount !== undefined && typeof amount !== "number") {
    return next(new ApiError("Amount must be a number", 400));
  }

  const transaction = await Transaction.findOne({ _id: id, user: req.user.id });

  if (!transaction) {
    return next(new ApiError("Transaction not found or unauthorized", 404));
  }

  transaction.text = text || transaction.text;
  transaction.amount = amount || transaction.amount;

  const updatedTransaction = await transaction.save();

  res.status(200).json({
    success: true,
    data: updatedTransaction,
  });
});

// Delete a transaction
exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!transaction) {
    return next(new ApiError("Transaction not found or unauthorized", 404));
  }

  await transaction.deleteOne({ _id: transaction._id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
