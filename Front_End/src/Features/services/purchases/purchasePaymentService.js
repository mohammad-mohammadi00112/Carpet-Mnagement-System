
import api from "../api";

export const getPurchasePayments = async () => {
  const response = await api.get("/purchase_payments");
  return response.data;
};

export const getPurchasePaymentById = async (id) => {
  const response = await api.get(`/purchase_payments/${id}`);
  return response.data;
};

export const getPurchasePaymentOptions = async (date) => {
  const response = await api.get("/purchase_payment_options", {
    params: date ? { date } : undefined
  });
  return response.data;
};

export const createPurchasePayment = async (paymentData) => {
  const response = await api.post("/purchase_payments", paymentData);
  return response.data;
};
