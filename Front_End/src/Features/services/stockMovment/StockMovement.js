import api from "../api";

export const getStockMovements = async () => {
  const response = await api.get("/stock_movements");
  return response.data;
};

export const getStockMovementById = async (id) => {
  const response = await api.get(`/stock_movements/${id}`);
  return response.data;
};

export const createStockAdjustment = async (data) => {
  const response = await api.post("/stock_movements/adjustment", data);
  return response.data;
};