import API from './index';

export const getProducts = (filters) => API.get('/products', { params: filters });
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (productData, token) => {
    return API.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  };
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
