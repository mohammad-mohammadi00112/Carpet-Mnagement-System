

import api from "../api";

const checkResponse = (response) => {
  if (response.data?.code) {
    throw new Error(response.data.detail || response.data.message || "Request failed");
  }
  return response.data;
};

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return checkResponse(response);
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return checkResponse(response);
};

export const createCustomer = async (customerData) => {
  const response = await api.post("/customers", customerData);
  return checkResponse(response);
};

export const updateCustomer = async (id, customerData) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return checkResponse(response);
};

export const updateCustomerStatus = async (id, is_active) => {
  const response = await api.patch(`/customers/${id}`, { is_active });
  return checkResponse(response);
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return checkResponse(response);
};
