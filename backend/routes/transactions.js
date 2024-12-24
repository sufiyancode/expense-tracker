const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions");

router.route("/").get(protect, getTransactions).post(protect, addTransaction);

router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
