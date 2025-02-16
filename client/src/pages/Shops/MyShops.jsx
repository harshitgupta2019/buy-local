// MyShops.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '../../api/shops';
import './MyShops.css';

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShops();
        setShops(response.data.data);
      } catch (err) {
        setError('Failed to fetch shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="page-container">

      <main className="main-content">
        {loading ? (
          <div className="loading-state">Loading shops...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : shops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏪</div>
            <p>No shops found. Add your first shop!</p>
            <Link to="/shops/new" className="add-button">
              + Add Shop
            </Link>
          </div>
        ) : (
          <div className="shops-grid">
            {shops.map((shop) => (
              <div key={shop.id} className="shop-card">
                <h2 className="shop-name">{shop.name}</h2>
                <p className="shop-description">{shop.description}</p>
                <div className="shop-details">
                  <p><strong>Category:</strong> {shop.category}</p>
                  <p><strong>City:</strong> {shop.address.city}</p>
                </div>
                <div className="shop-actions">
                  <Link to={`/shops/${shop._id}`} className="button secondary">
                    View Details
                  </Link>
                  <Link to={`/shop/dashboard/${shop._id}`} className="button primary">
                    Dashboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyShops;