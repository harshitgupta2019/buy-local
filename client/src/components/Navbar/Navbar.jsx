import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > -1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToAbout: true } });
    } else {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          LocalShop
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link hover-effect">
            Home
          </Link>
          <button onClick={scrollToAbout} className="nav-link hover-effect">
            About Us
          </button>
          
          {user ? (
            <>
              {user.role === 'shop_owner' ? (
                <>
                  <Link to="/shop/my-shops" className="nav-link hover-effect">
                    My Shops
                  </Link>
                  <Link to="/shop/add" className="nav-link hover-effect">
                    Add Shop
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/shops" className="nav-link hover-effect">
                    Shop Now
                  </Link>
                  <Link to="/customer/orders" className="nav-link hover-effect">
                    My Orders
                  </Link>
                  <Link to="/customer/cart" className="nav-link cart-link hover-effect">
                    Cart
                    {cartItems.length > 0 && (
                      <span className="cart-badge">{cartItems.length}</span>
                    )}
                  </Link>
                </>
              )}
              <div className="user-menu" onClick={() => navigate('/profile')}>
                <span className="profile-initial">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </>
          ) : (
            <Link to="/auth" className="nav-link auth-link hover-effect">
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;