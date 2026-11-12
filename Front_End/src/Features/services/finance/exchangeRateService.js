

import api from "../api";

export const getExchangeRates = async () => {
  const { data } = await api.get("/exchange_rates");

  if (!Array.isArray(data)) {
    throw new Error(data?.message || "Failed to load exchange rates");
  }

  return data;
}

export const getExchangeRateById = async (id) => {
  const { data } = await api.get(`/exchange_rates/${id}`);

  if (!Array.isArray(data)) {
    throw new Error(data?.message || "Failed to load exchange rate");
  }

  return data[0] || null;
};

export const createExchangeRate = async (exchangeRate) => {
  const { data } = await api.post("/exchange_rates", exchangeRate);

  if (data?.severity === "ERROR" || data?.error) {
    throw new Error(data.message || "Failed to add exchange rate");
  }

  return data;
};
