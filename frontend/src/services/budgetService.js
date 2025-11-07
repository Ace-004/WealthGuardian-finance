import { api } from "./api";

export const getBudgets = async () => {
  try {
    const { data } = await api.get("/budgets");
    return data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error.response?.data || error;
  }
};

export const getBudgetById = async (id) => {
  try {
    const { data } = await api.get(`/budgets/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error.response?.data || error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const { data } = await api.post("/budgets", budgetData);
    return data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error.response?.data || error;
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const { data } = await api.put(`/budgets/${id}`, budgetData);
    return data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error.response?.data || error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const { data } = await api.delete(`/budgets/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error.response?.data || error;
  }
};

export const getBudgetStatus = async () => {
  const { data } = await api.get("/budgets/status");
  return data;
};

// Get monthly spending for all categories
export const getMonthlySpending = async () => {
  const { data } = await api.get("/budgets/monthly-spending");
  return data;
};
