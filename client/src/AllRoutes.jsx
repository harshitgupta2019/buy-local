import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import ShopList from './pages/Shops/ShopList';
import ShopDetails from './pages/Shops/ShopDetails';
import AddShop from './pages/Shops/AddShop';
import ShopDashboard from './pages/Dashboard/ShopDashboard';
import Orders from './pages/Orders/Orders';
import Profile from './pages/Profile/Profile';
import MyShops from './pages/Shops/MyShops';
import Cart from './pages/Cart/Cart';

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/shops" element={<ShopList />} />
      <Route path="/shops/:id" element={<ShopDetails />} />

      {/* Shop Owner Routes */}
      <Route path="/shop/*" element={
        <PrivateRoute allowedRoles={['shop_owner']}>
          <Routes>
            <Route path="add" element={<AddShop />} />
            <Route path="my-shops" element={<MyShops />} />
            <Route path="dashboard/:id" element={<ShopDashboard />} />
          </Routes>
        </PrivateRoute>
      } />

      {/* Customer Routes */}
      <Route path="/customer/*" element={
        <PrivateRoute allowedRoles={['customer']}>
          <Routes>
            <Route path="orders" element={<Orders />} />
            <Route path="cart" element={<Cart />} />
          </Routes>
        </PrivateRoute>
      } />

      {/* Profile Route for All Users */}
      <Route path="/profile" element={
        <PrivateRoute allowedRoles={['shop_owner', 'customer']}>
          <Profile />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default AllRoutes;
