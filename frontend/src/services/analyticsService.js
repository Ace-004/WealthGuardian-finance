import { api } from "./api";

export const analyticsService = {
  async getCategoryExpenses(timeframe = "month") {
    try {
      console.log("Fetching category expenses...");
      const response = await api.get(
        `/analytics/category-expenses?timeframe=${timeframe}`
      );
      console.log("Category expenses response:", response);

      const { data } = response;
      if (!Array.isArray(data)) {
        console.error("Unexpected data format from category-expenses:", data);
        return [];
      }

      const formattedData = data.map((item) => ({
        name: item.name || item._id || "Unknown",
        value: parseFloat(item.value) || parseFloat(item.total) || 0,
      }));
      console.log("Formatted category data:", formattedData);
      return formattedData;
    } catch (error) {
      console.error(
        "Error fetching category expenses:",
        error?.response?.data || error.message
      );
      return [];
    }
  },

  async getIncomeExpenseComparison(months = 6) {
    try {
      const { data } = await api.get(
        `/analytics/income-expense?months=${months}`
      );
      if (!Array.isArray(data)) {
        console.error("Unexpected data format from income-expense");
        return [];
      }
      return data.map((item) => ({
        month: item.month || "Unknown",
        income: parseFloat(item.income) || 0,
        expense: parseFloat(item.expense) || 0,
      }));
    } catch (error) {
      console.error("Error fetching income/expense comparison:", error);
      return [];
    }
  },

  async getFinancialTrends(timeframe = "year") {
    try {
      const { data } = await api.get(
        `/analytics/trends?timeframe=${timeframe}`
      );
      if (!Array.isArray(data)) {
        console.error("Unexpected data format from trends");
        return [];
      }
      return data.map((item) => ({
        date: item.date || "Unknown",
        balance: parseFloat(item.balance) || 0,
        savings: parseFloat(item.savings) || 0,
      }));
    } catch (error) {
      console.error("Error fetching financial trends:", error);
      return [];
    }
  },

  async getSavingsRate(months = 12) {
    try {
      const { data } = await api.get(
        `/analytics/savings-rate?months=${months}`
      );
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching savings rate:", error);
      return [];
    }
  },

  async getTopTransactions(limit = 5) {
    try {
      const { data } = await api.get(
        `/analytics/top-transactions?limit=${limit}`
      );
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching top transactions:", error);
      return [];
    }
  },
};
