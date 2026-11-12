

import api from "../api";

export const getExpenseCategories = async () => {
  const response = await api.get("/expense_categories");
  return response.data;
};

export const getExpenseCategoryById = async (id) => {
  const response = await api.get(`/expense_categories/${id}`);
  return response.data;
};

export const createExpenseCategory = async (data) => {
  const response = await api.post("/expense_categories", data);
  return response.data;
};

export const updateExpenseCategory = async (id, data) => {
  const response = await api.put(`/expense_categories/${id}`, data);
  return response.data;
};

export const deleteExpenseCategory = async (id) => {
  const response = await api.delete(`/expense_categories/${id}`);
  return response.data;
};
