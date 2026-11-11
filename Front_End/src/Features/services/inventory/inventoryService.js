
import api from "../api";

export const getInventory = async () => {
  const response = await api.get("/inventory");
  return response.data;
};

export const getInventoryById = async (id) => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};