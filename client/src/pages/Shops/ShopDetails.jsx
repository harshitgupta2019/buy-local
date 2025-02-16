import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Edit, Trash2, X } from 'lucide-react';
import { getShopById } from '../../api/shops';
import { getProducts, deleteProduct, updateProduct, createProduct  } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Add this import
import './ShopDetails.css';

const ProductModal = ({ isOpen, onClose, product, onSubmit, mode }) => {
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
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: product.image
      });
      if (product.image) {
        setImagePreview(`http://localhost:5000/uploads/${product.image}`);
      }
    } else {
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
    <div className="modal-content">
      <div className="modal-header">
        <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        {mode === 'edit' ? (
          // Edit mode - only show price and stock
          <>
            <div className="form-group">
              <div className="input-container">
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
            </div>
            <div className="form-group">
              <div className="input-container">
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
            </div>
          </>
        ) : (
          // Add mode - show all fields
          <>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="name">Name</label>
              </div>
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="description">Description</label>
              </div>
            </div>
            <div className="form-group">
              <div className="input-container">
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
            </div>
            <div className="form-group">
              <div className="input-container">
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
            </div>
            <div className="form-group">
              <div className="select-container">
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
                    />
                  </div>
                </div>
              </div>
          </>
        )}
        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {mode === 'edit' ? 'Update' : 'Add'} Product
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [productQuantities, setProductQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isShopOwner = user && shop && user._id === shop.owner;

  useEffect(() => {
    loadShopDetails();
  }, [id]);

  const loadShopDetails = async () => {
    try {
      setLoading(true);
      const [shopResponse, productsResponse] = await Promise.all([
        getShopById(id),
        getProducts({ shopId: id })
      ]);
      setShop(shopResponse.data);
      const productsData = Array.isArray(productsResponse.data.data) 
        ? productsResponse.data.data
        : [];
      setProducts(productsData);

      if (!isShopOwner) {
        const initialQuantities = {};
        productsData.forEach(product => {
          const cartItem = cartItems.find(
            item => item.productId === product._id && item.shopId === id
          );
          initialQuantities[product._id] = cartItem ? cartItem.quantity : 0;
        });
        setProductQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Error loading shop details:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    
    const { street, city, state, zip } = address;
    return `${street}, ${city}, ${state} ${zip}`.trim();
  };

  const getCategories = () => {
    const categories = new Set((Array.isArray(products) ? products : [])
      .map(product => product.category)
      .filter(Boolean));
    return ['all', ...Array.from(categories)];
  };

  const filteredProducts = Array.isArray(products) 
    ? products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];


  // Customer-specific functions
  const handleUpdateQuantity = (productId, change) => {
    if (isShopOwner) return;
    
    setProductQuantities(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (currentQuantity === newQuantity) {
        return prev;
      }
      
      return {
        ...prev,
        [productId]: newQuantity
      };
    });
  };

  const handleAddToCart = (product) => {
    if (isShopOwner) return;

    const quantity = productQuantities[product._id] || 0;
    if (quantity > 0) {
      addToCart({
        productId: product._id,
        shopId: id,
        shopName: shop?.name,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      }, shop);
      
      setProductQuantities(prev => ({
        ...prev,
        [product.id]: 0
      }));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductSubmit = async (formData, mode) => {
    try {
      if (mode === 'edit') {
        const response = await updateProduct(selectedProduct._id, formData);
        // Update the products state with the updated product
        setProducts(prevProducts => [...prevProducts, response.data.data]);
      } else {
        // Add shop ID to form data for creation
        formData.append('shop', id);
        formData.append('status', 'available');
        
        const response = await createProduct(formData);
        // Add the new product to the products state
        setProducts(prevProducts => [...prevProducts, response.data.data]);
      }
      handleCloseModal();
      // Reload products to ensure consistency
      loadShopDetails();
    } catch (error) {
      console.error('Error saving product:', error);
      // You might want to show an error message to the user here
    }
  };

  // Render product card based on user role
  const renderProductCard = (product) => {
    if (isShopOwner) {
      return (
        <div key={product._id} className="product-card owner-view">
          <div className="product-image">
            <img src={product.image ? `http://localhost:5000/uploads/${product.image}` : ''} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-price">₹{product.price.toFixed(2)}</div>
            <div className="stock-info">Stock: {product.stock}</div>
            <div className="owner-actions">
              <button 
                className="edit-btn"
                onClick={() => handleOpenEditModal(product)}
              >
                <Edit size={16} /> Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteProduct(product._id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Customer view
    return (
      <div key={product._id} className="product-card">
        <div className="product-image">
          <img src={product.image ? `http://localhost:5000/uploads/${product.image}` : ''} alt={product.name} />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">₹{product.price.toFixed(2)}</div>
          {product.stock > 0 ? (
            <div className="product-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => handleUpdateQuantity(product._id, -1)}
                  disabled={!productQuantities[product._id]}
                  className="quantity-button"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">
                  {productQuantities[product._id] || 0}
                </span>
                <button 
                  onClick={() => handleUpdateQuantity(product._id, 1)}
                  className="quantity-button"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={!productQuantities[product._id]}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <button className="out-of-stock-btn" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="error">Shop not found</div>;
  }

  return (
    <div className="shop-details-container">
      <div className="shop-header">
        <div className="shop-hero">
          <img src={shop.image ? `http://localhost:5000/uploads/${shop.image}` : ''} alt={shop.name} />
          <div className="shop-hero-content">
            <h1>{shop.name}</h1>
            <p className="shop-category">{shop.category}</p>
            <div className="shop-rating">
              <span className="stars">{'★'.repeat(Math.floor(shop.rating))}</span>
              <span className="rating-value">({shop.rating})</span>
            </div>
            <p className="shop-address">{formatAddress(shop.address)}</p>
            {shop.isOpen ? (
              <span className="status open">Open Now</span>
            ) : (
              <span className="status closed">Closed</span>
            )}
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="products-header">
          {/* Modified header layout */}
          <div className="top-row">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isShopOwner && (
              <button 
                className="add-product-btn"
                onClick={handleOpenAddModal}
              >
                <Plus size={16} /> Add New Product
              </button>
            )}
          </div>

          <div className="bottom-row">
            <div className="categories-filter">
              {getCategories().map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            filteredProducts.map(product => renderProductCard(product))
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSubmit={handleProductSubmit}
        mode={modalMode}
      />
    </div>
  );
};

export default ShopDetails;