// src/components/CartItem/CartItem.jsx
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { productId, shopId, name, price, image, quantity } = item;

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, shopId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId, shopId);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover"
        />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{name}</h3>
        <div className="cart-item-price">₹{price.toFixed(2)}</div>
      </div>

      <div className="cart-item-actions">
        <div className="cart-quantity-controls">
          <button 
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="cart-quantity-button"
          >
            <Minus size={16} />
          </button>
          <span className="cart-quantity-display">{quantity}</span>
          <button 
            onClick={() => handleUpdateQuantity(quantity + 1)}
            className="cart-quantity-button"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="cart-item-subtotal">
        ₹{(price * quantity).toFixed(2)}
        </div>

        <button 
          onClick={handleRemove}
          className="cart-remove-button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

