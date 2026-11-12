
import api from "../api";

export const getPurchaseDetails = async () => {
  const response = await api.get("/purchase_details");
  return response.data;
};

export const getPurchaseDetailById = async (id) => {
  const response = await api.get(`/purchase_details/${id}`);
  return response.data;
};

export const createPurchaseDetail = async (detailData) => {
  const response = await api.post("/purchase_details", detailData);
  return response.data;
};

export const updatePurchaseDetail = async (id, detailData) => {
  const response = await api.put(`/purchase_details/${id}`, detailData);
  return response.data;
};

export const deletePurchaseDetail = async (id) => {
  const response = await api.delete(`/purchase_details/${id}`);
  return response.data;
};
