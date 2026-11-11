

import api from "../api";

export const getSaleDetails = async () => {
  const response = await api.get("/sales_details");
  return response.data;
};

export const getSaleDetailById = async (id) => {
  const response = await api.get(`/sales_details/${id}`);
  return response.data;
};

export const createSaleDetail = async (detailData) => {
  const response = await api.post("/sales_details", detailData);
  return response.data;
};

export const updateSaleDetail = async (id, detailData) => {
  const response = await api.put(`/sales_details/${id}`, detailData);
  return response.data;
};

export const patchSaleDetail = async (id, detailData) => {
  const response = await api.patch(`/sales_details/${id}`, detailData);
  return response.data;
};

export const deleteSaleDetail = async (id) => {
  const response = await api.delete(`/sales_details/${id}`);
  return response.data;
};
