import { useState, useEffect } from 'react';
import { getOrders } from '../../api/orders';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-info">
              <p>Shop: {order.shop.name}</p>
              <p>Pickup Time: {formatDate(order.pickupTime)}</p>
              <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
            </div>
            
            <div className="order-items">
              <h4>Items:</h4>
              {order.products.map((item) => (
                <div key={item._id} className="order-item">
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;