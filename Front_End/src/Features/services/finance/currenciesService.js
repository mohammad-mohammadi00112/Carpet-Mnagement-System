
import api from "../api";

export const getCurrencies = async () => {
  const response = await api.get("/currencies");
  return response.data;
};

export const createCurrency = async (currencyData) => {
  const response = await api.post("/currencies", currencyData);
  return response.data;
};

export const updateCurrency = async (id, currencyData) => {
  const response = await api.put(`/currencies/${id}`, currencyData);
  return response.data;
};

export const deleteCurrency = async (id) => {
  const response = await api.delete(`/currencies/${id}`);
  return response.data;
};