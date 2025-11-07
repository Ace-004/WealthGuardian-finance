const mongoose = require("mongoose");
const Transaction = require("../models/transactions");
const {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
} = require("date-fns");
const analyticsController = {
  // Get category-wise expenses for the current month or specified timeframe
  async getCategoryExpenses(req, res) {
    try {
      const { timeframe = "month" } = req.query;
      const userId = req.userId;

      let startDate =
        timeframe === "month"
          ? startOfMonth(new Date())
          : startOfYear(new Date());
      let endDate = timeframe === "month" ? endOfMonth(new Date()) : new Date();

      console.log('analytics query ',{userId,startDate,endDate,timeframe});
      

      const categoryExpenses = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
      ]);
      res.json(categoryExpenses); 
      
    } catch (error) {
      console.log('error fetching data: ',error);
      
      res.status(500).json({ message: "Error fetching category expenses" });
    }
  },

  // Get income vs expense comparison for the last N months
  async getIncomeExpenseComparison(req, res) {
    try {
      const { months = 6 } = req.query;
      const userId = req.userId;

      const comparison = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: subMonths(new Date(), months - 1) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
              },
            },
            expense: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
              },
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.month" },
                "/",
                { $toString: "$_id.year" },
              ],
            },
            income: 1,
            expense: 1,
          },
        },
      ]);

      res.json(comparison);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching income/expense comparison" });
    }
  },

  // Get financial trends data
  async getFinancialTrends(req, res) {
    try {
      const { timeframe = "year" } = req.query;
      const userId = req.userId;

      let startDate =
        timeframe === "year"
          ? startOfYear(new Date())
          : startOfMonth(new Date());

      const trends = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate },
          },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$date",
                },
              },
            },
            balance: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "income"] },
                  "$amount",
                  { $multiply: ["$amount", -1] },
                ],
              },
            },
            savings: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "income"] },
                  { $multiply: ["$amount", 0.2] }, // Assuming 20% savings target
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            balance: 1,
            savings: 1,
          },
        },
      ]);

      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Error fetching financial trends" });
    }
  },

  // Get savings rate over time
  async getSavingsRate(req, res) {
    try {
      const { months = 12 } = req.query;
      const userId = req.userId;

      const savingsRate = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: subMonths(new Date(), months - 1) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
              },
            },
            expenses: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.month" },
                "/",
                { $toString: "$_id.year" },
              ],
            },
            savingsRate: {
              $multiply: [
                {
                  $divide: [{ $subtract: ["$income", "$expenses"] }, "$income"],
                },
                100,
              ],
            },
          },
        },
        {
          $sort: {
            month: 1,
          },
        },
      ]);

      res.json(savingsRate);
    } catch (error) {
      res.status(500).json({ message: "Error calculating savings rate" });
    }
  },

  // Get top transactions by amount
  async getTopTransactions(req, res) {
    try {
      const { limit = 5 } = req.query;
      const userId = req.userId;

      const topTransactions = await Transaction.find({ user: userId })
        .sort({ amount: -1 })
        .limit(Number(limit))
        .select("date description amount type category");

      res.json(topTransactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching top transactions" });
    }
  },
};

module.exports = analyticsController;
