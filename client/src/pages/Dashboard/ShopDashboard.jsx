import React, { useState, useEffect } from 'react';
import './ShopDashboard.css';
import { useParams } from 'react-router-dom';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../../api/products'; 
import { getOrders, updateOrderStatus } from '../../api/orders';
import { X } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onSubmit, mode = 'add' }) => {
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
  
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        image: product.image || null
      });
      if (product.image) {
        setImagePreview(`${process.env.REACT_APP_API_URL}/uploads/${product.image}` || `http://localhost:5000/uploads/${product.image}`);
      }
    } else {
      // Reset form data when adding a new product
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null
      });
      setImagePreview(null);
    }
  }, [product, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        submitData.append('image', formData[key]);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    await onSubmit(submitData, mode);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* In edit mode, only show fields that need to be edited frequently */}
          {mode === 'edit' ? (
            <>
              <div className="form-group">
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="price">Price</label>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="stock">Stock</label>
              </div>
            </>
          ) : (
            // Full form for adding new products
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="name">Product Name</label>
              </div>
              
              <div className="form-group">
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="description">Description</label>
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="price">Price</label>
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="stock">Stock</label>
              </div>
              
              <div className="form-group">
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <label htmlFor="category">Category</label>
              </div>
              
              <div className="form-group">
                <div className="file-input-group">
                  <label htmlFor="image" className="file-label">Product Image</label>
                  <div className="image-upload-container">
                    <div className="image-preview-wrapper">
                      {imagePreview ? (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Product preview" />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="no-image">
                          <span>No image selected</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="file-input"
                      required={!product}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              {mode === 'edit' ? 'Update' : 'Add'} Product
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Order Details #{order._id.slice(-6)}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="order-details-content">
          <div className="order-info-grid">
            <div className="info-group">
              <label>Customer</label>
              <span>{order.user?.name || 'Anonymous'}</span>
            </div>
            <div className="info-group">
              <label>Status</label>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="info-group">
              <label>Pickup Time</label>
              <span>{new Date(order.pickupTime).toLocaleString()}</span>
            </div>
            <div className="info-group">
              <label>Total Amount</label>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-items">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopDashboard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0  // Changed from Set to number
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [products, setProducts] = useState([]);

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
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setShowAddModal(true);
  };
  
  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setShowAddModal(true);
  };
  
  const handleProductSubmit = async (formData, mode) => {
    try {
      if (mode === 'edit') {
        await updateProduct(selectedProduct._id, formData);
      } else {
        formData.append('shop', id);
        formData.append('status', 'available');
        await createProduct(formData);
      }
      fetchProducts(id);
      setShowAddModal(false);
      setSelectedProduct(null);
      setModalMode('add');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
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


  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Update the products table section in the render
  const renderProductsTable = () => (
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
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Update the orders table to include view details button
  const renderOrdersTable = () => (
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
                    onClick={() => setSelectedOrder(order)}
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
  );
  

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Shop Dashboard</h1>
        <button className="btn-primary" onClick={handleAddNewProduct}>
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

          {activeTab === 'products' && renderProductsTable()}
          {activeTab === 'orders' && renderOrdersTable()}
        </div>
      </div>

      <ProductModal 
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        mode={modalMode}
        onSubmit={handleProductSubmit}
      />

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default ShopDashboard;