// api/auth.js
import API from './index';

export const login = (formData) => {
  return API.post('/auth/login', formData)
    .then(response => {
      // Log the full response for debugging
      console.log('Login Response:', response);
      
      // Validate response structure
      if (response.data && response.data.user && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('Invalid login response structure');
      }
    })
    .catch(error => {
      // Log detailed error information
      console.error('Login Error:', error.response ? error.response.data : error);
      
      // Throw a meaningful error message
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Login failed. Please try again.'
      );
    });
};

export const register = (formData) => {
  return API.post('/auth/register', formData)
    .then(response => {
      // Log the full response for debugging
      console.log('Register Response:', response);
      
      // Validate response structure
      if (response.data && response.data.user && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('Invalid registration response structure');
      }
    })
    .catch(error => {
      // Log detailed error information
      console.error('Registration Error:', error.response ? error.response.data : error);
      
      // Throw a meaningful error message
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    });
};

export const getCurrentUser = () => {
  return API.get('/auth/me')
    .then(response => {
      // Log the full response for debugging
      console.log('Get Current User Response:', response);
      
      // Validate response structure
      if (response.data && response.data.user) {
        return response.data.user;
      } else {
        throw new Error('Invalid user data');
      }
    })
    .catch(error => {
      // Log detailed error information
      console.error('Get Current User Error:', error.response ? error.response.data : error);
      
      // Throw a meaningful error message
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to fetch user data'
      );
    });
};