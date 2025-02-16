import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import './ShopCard.css';

const ShopCard = ({ shop }) => {
  const { _id, name, description, address, rating, isOpen, image } = shop;

  return (
    <Link to={`/shops/${_id}`} className="shop-card">
      <div className="shop-image-container">
        <img 
          src={image || '/api/placeholder/400/300'} 
          alt={name}
          className="shop-image"
        />
        <span className={`shop-status ${isOpen ? 'status-open' : 'status-closed'}`}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      
      <div className="shop-info">
        <h3 className="shop-name">{name}</h3>
        <p className="shop-description">{description}</p>
        
        <div className="shop-details">
          <div className="shop-detail-item">
            <MapPin size={16} className="text-gray-500" />
            <span>{address}</span>
          </div>
          <div className="shop-detail-item">
            <Clock size={16} className="text-gray-500" />
            <span>9:00 AM - 9:00 PM</span>
          </div>
        </div>

        {rating && (
          <div className="shop-rating">
            <span className="rating-stars">{'★'.repeat(Math.floor(rating))}</span>
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ShopCard;
