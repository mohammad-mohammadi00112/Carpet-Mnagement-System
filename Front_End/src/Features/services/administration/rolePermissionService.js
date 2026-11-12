
import api from "../api";

// Get all roles
export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

// Get all permissions
export const getPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

// Get all role-permission assignments
export const getRolePermissions = async () => {
  const response = await api.get("/role_permissions");
  return response.data;
};

// Assign a permission to a role
export const assignPermission = async (data) => {
  const response = await api.post("/role_permissions", data);
  return response.data;
};

// Remove an assignment using its role_permissions ID
export const removePermission = async (id) => {
  const response = await api.delete(`/role_permissions/${id}`);
  return response.data;
};