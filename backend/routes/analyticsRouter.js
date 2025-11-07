const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

const analyticsRouter = express.Router();

// Protect all analytics routes with authentication
analyticsRouter.use(auth);

// Get category-wise expenses
analyticsRouter.get(
  "/category-expenses",
  analyticsController.getCategoryExpenses
);

// Get income vs expense comparison
analyticsRouter.get(
  "/income-expense",
  analyticsController.getIncomeExpenseComparison
);

// Get financial trends
analyticsRouter.get("/trends", analyticsController.getFinancialTrends);

// Get savings rate
analyticsRouter.get("/savings-rate", analyticsController.getSavingsRate);

// Get top transactions
analyticsRouter.get(
  "/top-transactions",
  analyticsController.getTopTransactions
);

module.exports = analyticsRouter;
