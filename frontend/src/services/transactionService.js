import { api } from "./api";

export const listTransactions = async () => {
  const { data } = await api.get("/transactions");
  return data;
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/transactions", transactionData);
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return {
      success: true,
      data: {
        transaction: response.data.transaction,
        budgetStatus: response.data.budgetStatus,
      },
      message: "Transaction created successfully",
    };
  } catch (error) {
    console.error("Create transaction error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create transaction";
    return {
      success: false,
      error: errorMessage,
      details: error.response?.data?.details || {},
    };
  }
};

export const updateTransaction = async (id, transactionData) => {
  const { data } = await api.put(`/transactions/${id}`, transactionData);
  return data;
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    console.log("delete response", response.data);

    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete transaction",
    };
  }
};

// Analytics
export const getTransactionSummary = async () => {
  const { data } = await api.get("/transactions/summary");
  return data;
};

export const getTransactionsByCategory = async () => {
  const { data } = await api.get("/transactions/by-category");
  return data;
};
