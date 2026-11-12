
import api from "../api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const updateUserStatus = async (id, is_active) => {
  const response = await api.patch(`/users/${id}`, { is_active });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};