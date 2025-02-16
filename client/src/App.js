import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import AllRoutes from './AllRoutes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <CartProvider>
            <ShopProvider>
              <Navbar />
              <AllRoutes />
            </ShopProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
