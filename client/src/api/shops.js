import API from './index';

export const getShops = (filters) => API.get('/shops', { params: filters });
export const getShopById = (id) => API.get(`/shops/${id}`);

export const createShop = (formData) => {
  
  return API.post('/shops', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateShop = (id, shopData) => API.put(`/shops/${id}`, shopData);