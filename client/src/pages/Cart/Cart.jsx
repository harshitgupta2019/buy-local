import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import Button from '../../components/UI/Button/Button';
import CartItem from '../../components/CartItem/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeItem, clearCart, getCartTotal, shop } = useCart();
  const [pickupTime, setPickupTime] = useState('');
  const navigate = useNavigate();
  const shopId = shop?._id || (cartItems[0]?.shopId);
  const handleCheckout = async () => {
    if (!shopId) {
      alert('Shop information is missing. Please try adding items to cart again.');
      navigate('/shops');
      return;
    }
    if (!pickupTime) {
      alert('Please select a pickup time');
      return;
    }

    try {
      const orderData = {
        shop: shopId,
        products: cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        pickupTime: new Date(pickupTime),
        totalAmount: getCartTotal()
      };

      await createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert('Error creating order: ' + error.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onRemove={() => removeItem(item._id)}
          />
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Total:</span>
          <span>₹{getCartTotal()}</span>
        </div>
        
        <div className="pickup-time">
          <label>Select Pickup Time:</label>
          <input
            type="datetime-local"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleCheckout}
          disabled={!pickupTime}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
