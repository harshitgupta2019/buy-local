import { createContext, useState, useContext, useEffect } from 'react';
import { login, register, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage and get the user data if present
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // If there's a token, get the current user data
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      localStorage.removeItem('token'); // If there's an error, remove the token
    } finally {
      setLoading(false); // Set loading to false once the check is done
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      const { user, token } = await login(credentials);

      // Save token to localStorage for persistence
      localStorage.setItem('token', token);
      setUser(user); // Set the user data in state
      return user;
    } catch (err) {
      console.error('Login Error in Context:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError(null);
      const { user, token } = await register(userData);

      // Save token to localStorage after successful registration
      localStorage.setItem('token', token);
      setUser(user); // Set the user data in state
      return user;
    } catch (err) {
      console.error('Register Error in Context:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage on logout
    setUser(null); // Clear user data from state
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user, // Check if there's a logged-in user
    isShopOwner: user?.role === 'shop_owner' // Check if the user is a shop owner
  };

  if (loading) {
    return <div>Loading...</div>; // Consider a proper loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
