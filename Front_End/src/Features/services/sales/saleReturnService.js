

import api from "../api";

export const getSaleReturns = async () => {
  const response = await api.get("/sale_returns");
  return response.data;
};

export const getSaleReturnById = async (id) => {
  const response = await api.get(`/sale_returns/${id}`);
  return response.data;
};

export const createSaleReturn = async (returnData) => {
  const response = await api.post("/sale_returns", returnData);
  return response.data;
};
