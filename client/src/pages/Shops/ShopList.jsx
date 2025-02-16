import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShops } from '../../api/shops';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    distance: '',
    rating: '',
    isOpen: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    getUserLocation();
    fetchShops();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          // Fetch shops with location once we have it
          fetchShops({ ...filters, location });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fetch shops without location
          fetchShops(filters);
        }
      );
    } else {
      fetchShops(filters);
    }
  };

  const fetchShops = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare API filters
      const apiFilters = {
        ...currentFilters,
        lat: userLocation?.lat,
        lng: userLocation?.lng
      };

      // Remove empty filters
      Object.keys(apiFilters).forEach(key => 
        !apiFilters[key] && delete apiFilters[key]
      );

      const response = await getShops(apiFilters);
      // Ensure we're working with an array of shops
      const shopsData = Array.isArray(response.data.data) ? response.data.data : 
                       response.data.shops ? response.data.shops : [];
      
      setShops(shopsData);
      setFilteredShops(shopsData);
    } catch (error) {
      console.error("Error fetching shops:", error);
      setError(error.response?.data?.message || 'Failed to fetch shops. Please try again later.');
      // Set empty arrays when there's an error
      setShops([]);
      setFilteredShops([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    
    const { street, city, state, zip } = address;
    return `${street}, ${city}, ${state} ${zip}`.trim();
  };


  const calculateDistance = (shopLat, shopLng) => {
    if (!userLocation) return null;
    
    // Haversine formula for calculating distance
    const R = 6371; // Earth's radius in km
    const dLat = (shopLat - userLocation.lat) * Math.PI / 180;
    const dLon = (shopLng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(shopLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const newFilters = {
      ...filters,
      [name]: newValue
    };
    
    setFilters(newFilters);
    fetchShops(newFilters);
  };

  // Debug logging to check the shape of filteredShops
  useEffect(() => {
    console.log('filteredShops:', filteredShops);
  }, [filteredShops]);

  return (
    <div className="shop-list-container">
      <div className="filters-section">
        <h2>Filters</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="grocery">Grocery</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="restaurant">Restaurant</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Distance (km)</label>
            <select 
              name="distance" 
              value={filters.distance}
              onChange={handleFilterChange}
            >
              <option value="">Any Distance</option>
              <option value="1">Within 1 km</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>
            <select 
              name="rating" 
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div className="filter-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isOpen"
                checked={filters.isOpen}
                onChange={handleFilterChange}
              />
              Open Now
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="shops-grid">
        {loading ? (
          <div className="loading">Loading shops...</div>
        ) : !Array.isArray(filteredShops) ? (
          <div className="error-message">Invalid data format received</div>
        ) : filteredShops.length === 0 ? (
          <div className="no-shops">No shops found matching your criteria</div>
        ) : (
          filteredShops.map(shop => (
            <div 
              key={shop.id} 
              className="shop-card"
              onClick={() => navigate(`/shops/${shop._id}`)}
            >
              <div className="shop-image">
              <img 
                src={shop.image ? (`${process.env.REACT_APP_API_URL}/uploads/${shop.image}`|| `http://localhost:5000/uploads/${shop.image}`) : ''} 
                alt={shop.name} 
                onError={(e) => { e.target.src = ''; }}
              />
                {shop.isOpen ? (
                  <span className="status open">Open</span>
                ) : (
                  <span className="status closed">Closed</span>
                )}
              </div>
              <div className="shop-info">
                <h3>{shop.name}</h3>
                <p className="shop-category">{shop.category}</p>
                {userLocation && shop.lat && shop.lng && (
                  <p className="shop-distance">
                    {calculateDistance(shop.lat, shop.lng)} km away
                  </p>
                )}
                <div className="shop-rating">
                  <span className="stars">{'★'.repeat(Math.floor(shop.rating || 0))}</span>
                  <span className="rating-value">({shop.rating || 0})</span>
                </div>
                <p className="shop-address">{formatAddress(shop.address)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopList;