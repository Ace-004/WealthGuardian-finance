const Budget = require("../models/budget");
const Transaction = require("../models/transactions");
const mongoose = require("mongoose");

// Debug function
const debugLog = (message, data) => {
  console.log(`[Budget Controller] ${message}`, data);
};

//Get all budgets with detailed stats for the logged-in user
exports.getBudgets = async (req, res, next) => {
  try {
    if (!req.userId) {
      debugLog("Missing userId in request", { headers: req.headers });
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      debugLog("Invalid userId format", { userId: req.userId });
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    debugLog("Processing request for user", { userId: req.userId });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get budgets
    const budgets = await Budget.find({
      user: new mongoose.Types.ObjectId(req.userId),
    });

    // Get transactions for trend analysis
    const transactionTrends = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          type: "expense",
          date: {
            $gte: new Date(
              startOfMonth.getFullYear(),
              startOfMonth.getMonth() - 2
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    // Calculate trends and projections
    const budgetsWithStats = budgets.map((budget) => {
      const monthlyTrends = transactionTrends
        .filter((t) => t._id.category === budget.category)
        .sort(
          (a, b) =>
            new Date(b._id.year, b._id.month) -
            new Date(a._id.year, a._id.month)
        );

      const trend =
        monthlyTrends.length > 1
          ? ((monthlyTrends[0].totalSpent - monthlyTrends[1].totalSpent) /
              monthlyTrends[1].totalSpent) *
            100
          : 0;

      const averageSpending =
        monthlyTrends.reduce((sum, t) => sum + t.totalSpent, 0) /
        (monthlyTrends.length || 1);

      return {
        ...budget.toObject(),
        trend,
        averageSpending,
        projectedOverspend: averageSpending > budget.monthlyLimit,
      };
    });

    res.json(budgetsWithStats);
  } catch (err) {
    next(err);
  }
};

// Create a new budget
exports.createBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit } = req.body;
    const userId = new mongoose.Types.ObjectId(req.userId);

    const exists = await Budget.findOne({ user: userId, category });
    if (exists)
      return res
        .status(409)
        .json({ message: "Budget for category already exists" });

    const budget = await Budget.create({
      user: userId,
      category,
      monthlyLimit,
    });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

// Edit a budget
exports.updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { monthlyLimit } = req.body;
    const userId = new mongoose.Types.ObjectId(req.userId);

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: userId },
      { monthlyLimit },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    next(err);
  }
};

// Delete a budget
exports.deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = new mongoose.Types.ObjectId(req.userId);

    const result = await Budget.findOneAndDelete({ _id: id, user: userId });
    if (!result) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

// Get detailed monthly spending analysis
exports.getMonthlySpending = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    console.log("Processing monthly spending for user:", req.userId);

    const userId = new mongoose.Types.ObjectId(req.userId);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [categorySpending, weeklyTrends, topTransactions] = await Promise.all(
      [
        // Category-wise spending
        Transaction.aggregate([
          {
            $match: {
              user: userId,
              type: "expense",
              date: { $gte: startOfMonth },
            },
          },
          {
            $group: {
              _id: "$category",
              spent: { $sum: "$amount" },
              count: { $sum: 1 },
              avgAmount: { $avg: "$amount" },
              maxAmount: { $max: "$amount" },
              minAmount: { $min: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              spent: 1,
              transactionCount: "$count",
              averageAmount: "$avgAmount",
              maxTransaction: "$maxAmount",
              minTransaction: "$minAmount",
            },
          },
        ]),

        // Weekly spending trends
        Transaction.aggregate([
          {
            $match: {
              user: userId,
              type: "expense",
              date: { $gte: startOfMonth },
            },
          },
          {
            $group: {
              _id: {
                week: { $week: "$date" },
                category: "$category",
              },
              totalSpent: { $sum: "$amount" },
            },
          },
          {
            $sort: { "_id.week": 1 },
          },
        ]),

        // Top 5 transactions per category
        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.userId),
              type: "expense",
              date: { $gte: startOfMonth },
            },
          },
          {
            $sort: { amount: -1 },
          },
          {
            $group: {
              _id: "$category",
              transactions: {
                $push: {
                  amount: "$amount",
                  date: "$date",
                  description: "$description",
                },
              },
            },
          },
          {
            $project: {
              category: "$_id",
              topTransactions: { $slice: ["$transactions", 5] },
            },
          },
        ]),
      ]
    );

    // Process weekly trends
    const weeklySpendingByCategory = {};
    weeklyTrends.forEach((trend) => {
      if (!weeklySpendingByCategory[trend._id.category]) {
        weeklySpendingByCategory[trend._id.category] = [];
      }
      weeklySpendingByCategory[trend._id.category].push({
        week: trend._id.week,
        spent: trend.totalSpent,
      });
    });

    // Combine all data
    const detailedSpending = categorySpending.map((category) => ({
      ...category,
      weeklyTrend: weeklySpendingByCategory[category.category] || [],
      topTransactions:
        topTransactions.find((t) => t.category === category.category)
          ?.topTransactions || [],
    }));

    res.json(detailedSpending);
  } catch (err) {
    next(err);
  }
};

// Get comprehensive budget status
exports.getBudgetStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const budgets = await Budget.find({ user: userId });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get daily transactions for the current month
    const dailyTransactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
          dailySpent: { $sum: "$amount" },
        },
      },
    ]);

    // Get total transactions per category
    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.userId),
          type: "expense",
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
          averageTransaction: { $avg: "$amount" },
        },
      },
    ]);

    const spentMap = {};
    const statsMap = {};

    transactions.forEach((tx) => {
      spentMap[tx._id] = tx.totalSpent;
      statsMap[tx._id] = {
        transactionCount: tx.transactionCount,
        averageTransaction: tx.averageTransaction,
      };
    });

    // Calculate daily spending trends
    const getDailyTrend = (category) => {
      const dailySpending = dailyTransactions
        .filter((t) => t._id.category === category)
        .map((t) => ({
          date: t._id.date,
          amount: t.dailySpent,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return dailySpending;
    };

    const status = budgets.map((budget) => {
      const spent = spentMap[budget.category] || 0;
      const stats = statsMap[budget.category] || {
        transactionCount: 0,
        averageTransaction: 0,
      };
      const dailyTrend = getDailyTrend(budget.category);

      const daysInMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0
      ).getDate();
      const dayOfMonth = new Date().getDate();
      const projectedSpend = (spent / dayOfMonth) * daysInMonth;

      return {
        _id: budget._id,
        category: budget.category,
        monthlyLimit: budget.monthlyLimit,
        spent,
        percentUsed: Math.round((spent / budget.monthlyLimit) * 100),
        isExceeded: spent > budget.monthlyLimit,
        transactionCount: stats.transactionCount,
        averageTransaction: stats.averageTransaction,
        dailyTrend,
        projectedSpend,
        projectedOverspend: projectedSpend > budget.monthlyLimit,
        daysRemaining: daysInMonth - dayOfMonth,
        dailyBudgetRemaining:
          (budget.monthlyLimit - spent) / (daysInMonth - dayOfMonth),
      };
    });

    res.json(status);
  } catch (err) {
    next(err);
  }
};
