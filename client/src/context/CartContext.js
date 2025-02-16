
import { createContext, useContext, useReducer, useEffect, useState  } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => 
        item.productId === action.payload.productId && 
        item.shopId === action.payload.shopId
      );

      if (existingItem) {
        return state.map(item =>
          item.productId === action.payload.productId && item.shopId === action.payload.shopId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];

    case 'REMOVE_FROM_CART':
      return state.filter(item => 
        !(item.productId === action.payload.productId && 
          item.shopId === action.payload.shopId)
      );

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.productId === action.payload.productId && 
        item.shopId === action.payload.shopId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case 'CLEAR_CART':
      return [];

    case 'CLEAR_SHOP_ITEMS':
      return state.filter(item => item.shopId !== action.payload.shopId);

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [currentShop, setCurrentShop] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, shopData) => {
    if (cartItems.length > 0 && item.shopId !== cartItems[0].shopId) {
      if (!window.confirm('Adding items from a different shop will clear your current cart. Continue?')) {
        return;
      }
      dispatch({ type: 'CLEAR_CART' });
    }
    setCurrentShop(shopData)
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (productId, shopId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, shopId } });
  };

  const updateQuantity = (productId, shopId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, shopId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearShopItems = (shopId) => {
    dispatch({ type: 'CLEAR_SHOP_ITEMS', payload: { shopId } });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearShopItems,
      getCartTotal,
      shop: currentShop
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};