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
    pincode: '',
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
      
      // Apply client-side filters
      applyClientSideFilters(shopsData, currentFilters);
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

  // Apply filters that need to be handled client-side
  const applyClientSideFilters = (shops, currentFilters) => {
    let filtered = [...shops];
    
    // Apply isOpen filter client-side
    if (currentFilters.isOpen) {
      filtered = filtered.filter(shop => isShopOpen(shop));
    }
    
    // Apply pincode filter if provided
    if (currentFilters.pincode) {
      filtered = filtered.filter(shop => {
        if (typeof shop.address === 'object' && shop.address) {
          return shop.address.zip === currentFilters.pincode;
        } else if (typeof shop.address === 'string') {
          // Try to extract pincode from address string
          const addressParts = shop.address.split(' ');
          return addressParts.includes(currentFilters.pincode);
        }
        return false;
      });
    }
    
    setFilteredShops(filtered);
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

  const isShopOpen = (shop) => {
    if (!shop?.openingTime || !shop?.closingTime) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
    
    // Convert shop times to minutes for comparison
    const [openHours, openMinutes] = shop.openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = shop.closingTime.split(':').map(Number);
    
    const openingTimeInMinutes = openHours * 60 + openMinutes;
    const closingTimeInMinutes = closeHours * 60 + closeMinutes;
    
    // Handle cases where closing time is after midnight
    if (closingTimeInMinutes < openingTimeInMinutes) {
      return currentTime >= openingTimeInMinutes || currentTime <= closingTimeInMinutes;
    }
    
    return currentTime >= openingTimeInMinutes && currentTime <= closingTimeInMinutes;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const newFilters = {
      ...filters,
      [name]: newValue
    };
    
    setFilters(newFilters);
    
    // Handle client-side filters separately
    if (name === 'isOpen' || name === 'pincode') {
      applyClientSideFilters(shops, newFilters);
    } else {
      // Fetch from API for other filters
      fetchShops(newFilters);
    }
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
          
          <div className="filter-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
              placeholder="Enter pincode"
            />
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
              key={shop.id || shop._id} 
              className="shop-card"
              onClick={() => navigate(`/shops/${shop._id}`)}
            >
              <div className="shop-image">
                <img 
                  src={shop.image ? (`${process.env.REACT_APP_API_URL}/uploads/${shop.image}` || `http://localhost:5000/uploads/${shop.image}`) : ''} 
                  alt={shop.name} 
                  onError={(e) => { e.target.src = ''; }}
                />
                {isShopOpen(shop) ? (
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
                {shop.description && (
                  <div className="shop-description">
                    <p>{shop.description}</p>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Opening Hours</span>
                  <span className="detail-value">
                    {formatTime(shop.openingTime)} - {formatTime(shop.closingTime)}
                  </span>
                </div>
                <div className="shop-rating">
                  <span className="stars">{'★'.repeat(Math.floor(shop.rating || 5))}</span>
                  <span className="rating-value">({shop.rating || 5})</span>
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