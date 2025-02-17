import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";
import bannerImage from "../../assests/banner.png";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.scrollToAbout) {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Local Grocery Shops</h1>
          <p className="hero-subtitle">
            Connect with neighborhood stores and shop conveniently from the
            comfort of your home
          </p>
          <div className="hero-buttons">
            {
              user?.role === "shop_owner" ? (
                <Link to="/shop/my-shops" className="primary-button">
                  My Shops
                </Link>
              ):(
                <Link to="/shops" className="primary-button">
                  Explore Shops
                </Link>
              )
            } 
            
            {!isAuthenticated && (
              <Link to="/auth" className="secondary-button">
                Join Us
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src={bannerImage} alt="Local Shopping" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-content">
          <h2 className="section-title">Why Choose LocalShop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>Support Local</h3>
              <p>Help your community thrive by supporting local businesses</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Easy Delivery</h3>
              <p>Get groceries delivered to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Compare prices and find the best deals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality First</h3>
              <p>Verified shops and quality products</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-content">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            {[
              {
                number: "01",
                title: "Create Account",
                description: "Sign up as a customer or shop owner",
              },
              {
                number: "02",
                title: "Browse Shops",
                description: "Explore local stores in your area",
              },
              {
                number: "03",
                title: "Place Order",
                description: "Select items and choose delivery options",
              },
              {
                number: "04",
                title: "Quick Delivery",
                description: "Receive your items at your doorstep",
              },
            ].map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of happy customers shopping locally</p>
          <div className="cta-buttons">
            {
              user?.role === "shop_owner" ? (
                <Link to="/shop/my-shops" className="primary-button">
                  My Shops
                </Link>
              ):(
                <Link to="/shops" className="primary-button">
                  Browse Shops
                </Link>
              )
            } 
            {user?.role === "shop_owner" ? (
              <Link to="/shop/add" className="secondary-button">
                Add Your Shop
              </Link>
            ) : (
              
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="secondary-button"
              >
                Learn More
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="section-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Local Shops</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Orders Delivered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-content">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "LocalShop has made grocery shopping so much easier. I can
                support local businesses while getting everything delivered
                right to my door!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Regular Customer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "As a shop owner, this platform has helped me reach more
                customers and grow my business significantly."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <h4>Mike Thompson</h4>
                  <p>Shop Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "The variety of local shops available is amazing. I've
                discovered so many great stores in my neighborhood!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">L</div>
                <div className="author-info">
                  <h4>Lisa Chen</h4>
                  <p>Regular Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section */}
    </div>
  );
};

export default Home;
