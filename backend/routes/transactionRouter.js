const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const {
  listTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactionsByCategory,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", auth, listTransactions);
router.get("/summary", auth, getTransactionSummary);
router.get("/by-category", auth, getTransactionsByCategory);

router.post(
  "/",
  auth,
  [
    body("type").isIn(["income", "expense"]),
    body("category").isString().trim().notEmpty(),
    body("amount").isFloat({ gt: 0 }),
    body("date").isISO8601(),
  ],
  createTransaction
);

router.delete("/:id", auth, deleteTransaction);

module.exports = router;
