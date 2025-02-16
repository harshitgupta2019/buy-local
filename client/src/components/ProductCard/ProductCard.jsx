// src/components/ProductCard/ProductCard.jsx
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, shopId }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { _id, name, description, price, image, stock } = product;

  const handleAddToCart = () => {
    addToCart({
      productId: _id,
      shopId,
      name,
      price,
      image,
      quantity
    });
    setQuantity(1);
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image || '/api/placeholder/300/300'} 
          alt={name} 
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-price">₹{price.toFixed(2)}</div>

        <div className="product-actions">
          <div className="quantity-controls">
            <button 
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="quantity-button"
            >
              <Minus size={16} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= stock}
              className="quantity-button"
            >
              <Plus size={16} />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="add-to-cart-button"
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
