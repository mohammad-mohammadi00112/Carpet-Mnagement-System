

import api from "../api";

const checkResponse = (data, fallbackMessage) => {
  if (
    data?.severity === "ERROR" ||
    data?.error ||
    data?.code
  ) {
    throw new Error(
      data.message || data.detail || fallbackMessage
    );
  }

  return data;
};

export const getShopSettings = async () => {
  const { data } = await api.get("/shop_settings");

  checkResponse(data, "Failed to load shop settings");

  if (!Array.isArray(data)) {
    throw new Error("Invalid shop settings response");
  }

  return data;
};

export const getCurrencies = async () => {
  const { data } = await api.get("/currencies");

  checkResponse(data, "Failed to load currencies");

  if (!Array.isArray(data)) {
    throw new Error("Invalid currencies response");
  }

  return data;
};

export const getShopSettingById = async (id) => {
  const { data } = await api.get(`/shop_settings/${id}`);

  checkResponse(data, "Failed to load shop setting");

  if (!Array.isArray(data)) {
    throw new Error("Invalid shop setting response");
  }

  return data[0] || null;
};

export const createShopSettings = async (settings) => {
  const { data } = await api.post("/shop_settings", settings);

  return checkResponse(data, "Failed to create shop settings");
};

export const updateShopSettings = async (id, settings) => {
  const { data } = await api.put(`/shop_settings/${id}`, settings);

  return checkResponse(data, "Failed to update shop settings");
};
