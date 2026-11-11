

import api from "../api";

export const getSaleReturnDetails = async () => {
  const response = await api.get("/sale_return_details");
  return response.data;
};

export const getSaleReturnDetailById = async (id) => {
  const response = await api.get(`/sale_return_details/${id}`);
  return response.data;
};

export const createSaleReturnDetail = async (detailData) => {
  const response = await api.post("/sale_return_details", detailData);
  return response.data;
};
