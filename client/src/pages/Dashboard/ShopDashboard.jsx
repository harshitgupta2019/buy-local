import React, { useState, useEffect } from 'react';
import './ShopDashboard.css';
import { useParams } from 'react-router-dom';
import { createProduct, getProducts } from '../../api/products'; 
import { getOrders, updateOrderStatus } from '../../api/orders';

const ShopDashboard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0  // Changed from Set to number
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    'Food & Beverages',
    'Groceries',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Stationery',
    'Toys & Games',
    'Others'
  ]);

  useEffect(() => {
    if (id) {
      const initializeDashboard = async () => {
        await Promise.all([
          fetchProducts(id),
          fetchOrders(id)
        ]);
      };
      initializeDashboard();
    }
  }, [id]);

  // Update stats whenever orders or products change
  useEffect(() => {
    calculateStats(orders, products);
  }, [orders, products]);
  
  const calculateStats = (ordersData, productsData) => {
    const customerSet = new Set(ordersData.map(order => order.user?._id));
    const newStats = {
      totalOrders: ordersData.length,
      totalProducts: productsData.length,
      totalRevenue: ordersData.reduce((sum, order) => sum + order.totalAmount, 0),
      totalCustomers: customerSet.size
    };
    setStats(newStats);
  };

  const fetchOrders = async (shopId) => {
    try {
      setLoadingOrders(true);
      const response = await getOrders({"shopId": shopId});
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async (shopId) => {
    try {
      const response = await getProducts({"shopId": shopId}); 
      setProducts(response.data.data); 
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Get the image file
    const imageFile = e.target.image.files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const newProduct = {
      shop: id,
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock')),
      status: 'available',
      image: formData.get('image')
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await createProduct(newProduct, token);
      setProducts([...products, response.data.data]);
      setShowAddModal(false);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
    }
  };
  

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Shop Dashboard</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          Add New Product
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{stats.totalRevenue}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Customers</span>
            <span className="stat-value">{stats.totalCustomers}</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Recent Orders</h2>
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-item">
                    <div className="order-info">
                      <span>Order #{order._id}</span>
                      <span>by {order.user?.name || 'Anonymous'}</span>
                    </div>
                    <div className="order-details">
                      <span>₹{order.totalAmount}</span>
                      <span className={`status-select ${order.status}`}>
                       {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {activeTab === 'orders' && (
          <div className="table-container">
            {loadingOrders ? (
              <div className="loading">Loading orders...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Pickup Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user?.name || 'Anonymous'}</td>
                      <td>₹{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`status-select ${order.status}`}
                        >
                          <option value="ready">Ready To Pickup</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.pickupTime).toLocaleString()}</td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => {
                            // Add order details view functionality here
                            console.log('View order:', order);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder=" "
                  required 
                />
                <label htmlFor="name">Product Name</label>
              </div>
              
              <div className="form-group">
                <textarea 
                  id="description" 
                  name="description" 
                  placeholder=" "
                  required
                />
                <label htmlFor="description">Description</label>
              </div>
              
              <div className="form-group">
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  step="0.01" 
                  placeholder=" "
                  required 
                />
                <label htmlFor="price">Price</label>
              </div>
              
              <div className="form-group">
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  placeholder=" "
                  required 
                />
                <label htmlFor="stock">Stock</label>
              </div>
              
              <div className="form-group">
              <select
                id="category"
                name="category"
                required
                defaultValue=""
              >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <label htmlFor="category">Category</label>
            </div>
              
              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input 
                  type="file" 
                  id="image" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                  required 
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
              <button type="submit" className="btn-primary">
                  Add Product
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowAddModal(false);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;