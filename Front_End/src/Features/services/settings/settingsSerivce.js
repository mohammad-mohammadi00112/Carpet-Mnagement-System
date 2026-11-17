
import api from "../api";

// Get shop settings
export const getShopSettings = async () => {
  const response = await api.get("/shop_settings");
  return response.data;
};

// Get currencies
export const getCurrencies = async () => {
  const response = await api.get("/currencies");
  return response.data;
};

// Prepare settings data
const prepareSettingsData = (payload) => {
  const { logoFile, ...settingsData } = payload;

  // If no image is selected, send normal JSON data
  if (!logoFile) {
    return settingsData;
  }

  // If an image is selected, send FormData
  const formData = new FormData();

  Object.entries(settingsData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append("logo", logoFile);

  return formData;
};

// Create shop settings
export const createShopSettings = async (payload) => {
  const data = prepareSettingsData(payload);

  const response = await api.post("/shop_settings", data, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};

// Update shop settings
export const updateShopSettings = async (id, payload) => {
  const data = prepareSettingsData(payload);

  const response = await api.put(`/shop_settings/${id}`, data, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};
