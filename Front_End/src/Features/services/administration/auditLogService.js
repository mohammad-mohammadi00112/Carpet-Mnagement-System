

import api from "../api";

export const getAuditLogs = async () => {
  const response = await api.get("/audit_log");
  return response.data;
};

export const getAuditLogById = async (id) => {
  const response = await api.get(`/audit_log/${id}`);
  return response.data;
};
