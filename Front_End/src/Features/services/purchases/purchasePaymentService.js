
import api from "../api";

export const getPurchasePayments = async () => {
  const response = await api.get("/purchase_payments");
  return response.data;
};

export const getPurchasePaymentById = async (id) => {
  const response = await api.get(`/purchase_payments/${id}`);
  return response.data;
};

export const createPurchasePayment = async (paymentData) => {
  const response = await api.post("/purchase_payments", paymentData);
  return response.data;
};
