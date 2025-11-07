const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Transaction = require("../models/transactions");
const Budget = require("../models/budget");
const { getBudgetStatus } = require("./budgetController");

const updateBudgetStatus = async (userId) => {
  try {
    // This function will be called after transaction changes to recalculate budget status
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const budgets = await Budget.find({ user: userId });
    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const spentMap = transactions.reduce((acc, curr) => {
      acc[curr._id] = curr.totalSpent;
      return acc;
    }, {});

    // Update budget statuses
    await Promise.all(
      budgets.map(async (budget) => {
        const spent = spentMap[budget.category] || 0;
        budget.currentSpent = spent;
        await budget.save();
      })
    );

    return true;
  } catch (error) {
    console.error("Error updating budget status:", error);
    return false;
  }
};

const listTransactions = async (req, res, next) => {
  try {
    const { from, to, type, category } = req.query;
    const q = { user: req.userId };
    if (type) q.type = type;
    if (category) q.category = category;
    if (from || to)
      q.date = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };

    const items = await Transaction.find(q).sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const data = { ...req.body, user: req.userId };
    const item = await Transaction.create(data);

    // If it's an expense, update budget status
    if (data.type === "expense") {
      await updateBudgetStatus(req.userId);
    }

    // Get updated budget status
    const budgetStatus = await Budget.find({ user: req.userId });

    res.status(201).json({
      transaction: item,
      budgetStatus: budgetStatus,
    });
  } catch (e) {
    next(e);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("deleting id");

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.deleteOne({ _id: id });
    console.log("Transaction deleted");

    // If it was an expense, update budget status
    if (transaction.type === "expense") {
      await updateBudgetStatus(req.userId);
    }

    // Get updated budget status
    const budgetStatus = await Budget.find({ user: req.userId });

    return res.status(200).json({
      success: true,
      message: "Transaction deleted",
      budgetStatus: budgetStatus,
    });
  } catch (e) {
    console.log("error while deleting", e);
    next(e);
  }
};

// New methods for dashboard
const getTransactionSummary = async (req, res, next) => {
  try {
    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get monthly totals
    const monthlyTransactions = await Transaction.find({
      user: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    // Calculate current balance (all time)
    const allTransactions = await Transaction.find({ user: req.userId });
    const currentBalance = allTransactions.reduce((acc, transaction) => {
      return transaction.type === "income"
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);

    res.json({
      currentBalance,
      totalIncome,
      totalExpenses,
    });
  } catch (e) {
    next(e);
  }
};

const getTransactionsByCategory = async (req, res, next) => {
  try {
    // Get current month's transactions by category
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(req.userId);

    const categoryData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    // Log the results for debugging
    console.log("Category data:", {
      userId: req.userId,
      startOfMonth,
      endOfMonth,
      results: categoryData,
    });

    // Return empty array if no data
    if (!categoryData || categoryData.length === 0) {
      console.log("No category data found for the current month");
      return res.json([]);
    }

    res.json(categoryData);
  } catch (e) {
    console.error("Error in getTransactionsByCategory:", e);
    next(e);
  }
};

module.exports = {
  listTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactionsByCategory,
};
