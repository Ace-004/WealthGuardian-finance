const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const budgetController = require("../controllers/budgetController");

const budgetRouter = express.Router();

budgetRouter.get("/", auth, budgetController.getBudgets);

budgetRouter.post(
  "/",
  auth,
  body("category").isString().notEmpty(),
  body("monthlyLimit").isNumeric().isFloat({ gt: 0 }),
  budgetController.createBudget
);

budgetRouter.put(
  "/:id",
  auth,
  body("monthlyLimit").isNumeric().isFloat({ gt: 0 }),
  budgetController.updateBudget
);

budgetRouter.delete("/:id", auth, budgetController.deleteBudget);

budgetRouter.get("/status", auth, budgetController.getBudgetStatus);
budgetRouter.get(
  "/monthly-spending",
  auth,
  budgetController.getMonthlySpending
);

module.exports = budgetRouter;
