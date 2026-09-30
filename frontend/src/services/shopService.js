import axios from "axios";
import { BACKEND_URL } from "./authService";

const messageFrom = (error) => {
    return (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
};

export const getNotifications = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/notifications`);
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await axios.patch(`${BACKEND_URL}/api/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await axios.patch(`${BACKEND_URL}/api/notifications/read-all`);
    return response.data;
};

export const clearNotifications = async () => {
    const response = await axios.delete(`${BACKEND_URL}/api/notifications`);
    return response.data;
};

export const restockProduct = async (formData) => {
    const response = await axios.post(`${BACKEND_URL}/api/stock/restock`, formData);
    return response.data;
};

export const checkoutCart = async (payload) => {
    const response = await axios.post(`${BACKEND_URL}/api/stock/checkout`, payload);
    return response.data;
};

export const getReport = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/reports/summary`);
    return response.data;
};

export const getInvoice = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/reports/invoices/${id}`);
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/admin/users`);
    return response.data;
};

export const recordPayment = async (id, payload) => {
    const response = await axios.post(`${BACKEND_URL}/api/admin/users/${id}/payments`, payload);
    return response.data;
};

export const blockUser = async (id) => {
    const response = await axios.post(`${BACKEND_URL}/api/admin/users/${id}/block`);
    return response.data;
};

export { messageFrom };
