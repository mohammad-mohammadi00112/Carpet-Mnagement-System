

import api from "../api";

// ==================== Carpets ====================

export const getCarpets = async () => {
  const response = await api.get("/carpets");
  return response.data;
};

export const getCarpetById = async (id) => {
  const response = await api.get(`/carpets/${id}`);
  return response.data;
};

export const createCarpet = async (data) => {
  const response = await api.post("/carpets", data);
  return response.data;
};

export const updateCarpet = async (id, data) => {
  const response = await api.put(`/carpets/${id}`, data);
  return response.data;
};

export const patchCarpet = async (id, data) => {
  const response = await api.patch(`/carpets/${id}`, data);
  return response.data;
};

export const deleteCarpet = async (id) => {
  const response = await api.delete(`/carpets/${id}`);
  return response.data;
};

// ==================== Carpet Categories ====================

export const getCarpetCategories = async () => {
  const response = await api.get("/carpet_categ");
  return response.data;
};

export const getCarpetCategoryById = async (id) => {
  const response = await api.get(`/carpet_categ/${id}`);
  return response.data;
};

export const createCarpetCategory = async (data) => {
  const response = await api.post("/carpet_categ", data);
  return response.data;
};

export const updateCarpetCategory = async (id, data) => {
  const response = await api.put(`/carpet_categ/${id}`, data);
  return response.data;
};

export const patchCarpetCategory = async (id, data) => {
  const response = await api.patch(`/carpet_categ/${id}`, data);
  return response.data;
};

export const deleteCarpetCategory = async (id) => {
  const response = await api.delete(`/carpet_categ/${id}`);
  return response.data;
};
