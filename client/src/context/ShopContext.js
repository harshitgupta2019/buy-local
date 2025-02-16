import { createContext, useContext } from 'react';
import * as shopAPI from '../api/shops';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const createShop = async (formData) => {
    try {
      // Verify formData content
      console.log("FormData received in createShop:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      // Make the API call
      const response = await shopAPI.createShop(formData);
      
      // Log response
      console.log("API Response:", response);
  
      return response.data;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  };
  

  const getShopById = async (id) => {
    try {
      const response = await shopAPI.getShopById(id);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching shop:', error);
      if (error.response?.status === 404) {
        throw new Error('Shop not found');
      }
      throw new Error('Failed to fetch shop details');
    }
  };

  const value = {
    createShop,
    getShopById
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export default ShopContext;