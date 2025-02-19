import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loginimg from '../../assests/login.jpg'
import registerimg from '../../assests/register.jpg'
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    password: '',
    password2: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="main">
      {isLogin ? (
        <section className="sign-in">
          <div className="container">
            <div className="signin-content">
              <div className="signin-image">
                <figure>
                  <img src={loginimg} alt="login" />
                </figure>
                <button 
                  className="signup-image-link"
                  onClick={() => setIsLogin(false)}
                >
                  Create an account
                </button>
              </div>

              <div className="signin-form">
                <h2 className="form-title">LOGIN</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                  <div className="form-group input-textarea">
                    <label htmlFor="email">
                      <i className="zmdi zmdi-email"></i>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="password">
                      <i className="zmdi zmdi-lock"></i>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="form-group form-button">
                    <input
                      type="submit"
                      name="signin"
                      className="form-submit"
                      value="Log in"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="signup">
          <div className="container">
            <div className="signup-content">
              <div className="signup-form">
                <h2 className="form-title">REGISTER</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                  <div className="form-group input-textarea">
                    <label htmlFor="name">
                      <i className="zmdi zmdi-account material-icons-name"></i>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="email">
                      <i className="zmdi zmdi-email"></i>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="phone">
                      <i className="zmdi zmdi-phone"></i>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone No"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="gender">
                      <i className="zmdi zmdi-male-female"></i>
                    </label>
                    <input
                      type="text"
                      name="gender"
                      placeholder="Your Gender (Male/Female/Other)"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="age">
                      <i className="zmdi zmdi-calendar"></i>
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Your Age"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="password">
                      <i className="zmdi zmdi-lock"></i>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="password2">
                      <i className="zmdi zmdi-lock-outline"></i>
                    </label>
                    <input
                      type="password"
                      name="password2"
                      placeholder="Repeat your password"
                      value={formData.password2}
                      onChange={(e) => setFormData({...formData, password2: e.target.value})}
                    />
                  </div>
                  <div className="form-group input-textarea">
                    <label htmlFor="role">
                      <i className="zmdi zmdi-assignment-account"></i>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="customer">Customer</option>
                      <option value="shop_owner">Shop Owner</option>
                    </select>
                  </div>
                  <div className="form-group form-button">
                    <input
                      type="submit"
                      name="signup"
                      className="form-submit"
                      value="Register"
                    />
                  </div>
                </form>
              </div>
              <div className="signup-image">
                <figure>
                  <img src={registerimg} alt="sign up" />
                </figure>
                <button 
                  className="signup-image-link"
                  onClick={() => setIsLogin(true)}
                >
                  I am already member
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Auth;