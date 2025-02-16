import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Clock, Upload, X } from 'lucide-react';
import './AddShop.css'

const AddShop = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: { street: '', city: '', state: '', zip: '' },
    phone: '',
    category: '',
    openingTime: '',
    closingTime: '',
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { createShop } = useShop();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const submitData = new FormData();
  
      // Log before appending
      console.log("Original form data:", formData);
  
      // Basic fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('phone', formData.phone);
      submitData.append('category', formData.category);
      submitData.append('openingTime', formData.openingTime);
      submitData.append('closingTime', formData.closingTime);
  
      // Address
      const addressString = JSON.stringify({
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zip: formData.address.zip
      });
      submitData.append('address', addressString);
  
      // Image
      if (formData.image) {
        submitData.append('image', formData.image);
      }
  
      // Log after appending
      console.log("FormData in AddShop before sending:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      // Pass FormData directly to createShop
      const response = await createShop(submitData);
      
      if (response && response._id) {
        navigate(`/shops/${response._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-shop-container">
      <div className="form-wrapper">
        <h2 className="form-title">Add Your Shop</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="shop-form">
        <div className="image-upload-section">
            <div className="image-preview-container">
              {formData.imagePreview ? (
                <div className="image-preview-wrapper">
                  <img 
                    src={formData.imagePreview} 
                    alt="Shop preview" 
                    className="preview-image"
                  />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="remove-image-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <span>Upload Shop Image</span>
                </div>
              )}
            </div>
            <label className="upload-btn">
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="form-group floating">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="floating-input"
              placeholder=" "
            />
            <label htmlFor="name" className="floating-label">Shop Name</label>
          </div>

          <div className="form-group floating">
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              required
              className="floating-input"
              placeholder=" "
            />
            <label htmlFor="description" className="floating-label">Description</label>
          </div>

          <div className="form-section">
            <h3><span>📍</span> Address Details</h3>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="text"
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="street" className="floating-label">Street Address</label>
              </div>
              
              <div className="form-group floating">
                <input
                  type="text"
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="city" className="floating-label">City</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="text"
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="state" className="floating-label">State</label>
              </div>

              <div className="form-group floating">
                <input
                  type="text"
                  id="zip"
                  value={formData.address.zip}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zip: e.target.value }
                  })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="zip" className="floating-label">ZIP Code</label>
              </div>
            </div>
          </div>

          <div className="form-group floating">
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="floating-input"
              placeholder=" "
            />
            <label htmlFor="phone" className="floating-label">Phone</label>
          </div>

          <div className="form-group floating">
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="floating-input"
              placeholder=" "
            >
              <option value="">Select Category</option>
              <option value="grocery">Grocery</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
            </select>
            <label htmlFor="category" className="floating-label">Category</label>
          </div>

          <div className="form-section">
            <h3><Clock className="icon" /> Business Hours</h3>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="time"
                  id="openingTime"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="openingTime" className="floating-label">Opening Time</label>
              </div>

              <div className="form-group floating">
                <input
                  type="time"
                  id="closingTime"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  required
                  className="floating-input"
                  placeholder=" "
                />
                <label htmlFor="closingTime" className="floating-label">Closing Time</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating...' : 'Create Shop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShop;