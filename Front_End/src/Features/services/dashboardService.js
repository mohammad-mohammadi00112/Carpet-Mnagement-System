import api from "./api";

export const getDashboardData = async (period, signal) => {
  const response = await api.get("/dashboard", {
    params: { period },
    signal,
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Dashboard request failed");
  }

  return response.data.data;
};
