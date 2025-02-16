import API from './index';

export const getOrders = (filters) => API.get('/orders' , { params: filters });
export const createOrder = (orderData) => API.post('/orders', orderData);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });