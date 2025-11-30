import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiZap, FiStar, FiPackage } from "react-icons/fi";
import "../styles/upgrade.css";

const Pricing = () => {
  return (
    <div className="upgrade-wrapper">
      {/* HERO SECTION */}
      <div className="upgrade-hero">
        <h1 className="upgrade-title">
          Plans for Every Stage of Your <span>Journey</span>
        </h1>
        <p className="upgrade-subtitle">
          Start for free and upgrade when you're ready to accelerate your international job search 
          with AI-powered tools and unlimited tracking.
        </p>
      </div>

      {/* PRICING CARDS CONTAINER */}
      {/* Inline styles added to ensure side-by-side layout using existing container class base */}
      <div className="pricing-container" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '2rem', 
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        
        {/* FREE CARD */}
        <div className="pricing-card" style={{ flex: '1', minWidth: '320px', maxWidth: '450px' }}>
          <div className="pricing-header">
            <FiPackage className="premium-icon" style={{ color: '#64748b' }} />
            <h2 className="plan-title">Free Plan</h2>
            <p className="plan-price">
              <span>$0</span> / month
            </p>
          </div>

          <div className="features-list">
            
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Basic AI job matching
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              1 Resume Version
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Basic application dashboard
            </div>
            
            {/* Disabled features to show contrast */}
            <div className="feature-disabled">
              <FiXCircle className="cross-icon" />
              AI Cover Letter Generator
            </div>
            <div className="feature-disabled">
              <FiXCircle className="cross-icon" />
              Unlimited Resume Uploads
            </div>
          </div>

          <Link 
            to="/signup" 
            className="upgrade-btn" 
            style={{ backgroundColor: '#64748b', marginTop: 'auto' }}
          >
            Get Started Free
          </Link>
          <p className="secure-text">No credit card required</p>
        </div>

        {/* PRO CARD */}
        <div className="pricing-card" style={{ 
          flex: '1', 
          minWidth: '320px', 
          maxWidth: '450px',
          border: '2px solid #6366f1', 
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Badge for Pro */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#6366f1',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            Most Popular
          </div>

          <div className="pricing-header">
            <FiStar className="premium-icon" />
            <h2 className="plan-title">Pro Plan</h2>
            <p className="plan-price">
              <span>$19</span> / month
            </p>
          </div>

          <div className="features-list">
            
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Advanced AI job matching
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Unlimited resume versions
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              AI Cover Letter Generator
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              AI Career Coach
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Analytics & Priority Support
            </div>
          </div>

          <Link to="/signup" className="upgrade-btn">
            <FiZap className="zap-icon" /> Get Pro Access
          </Link>
          <p className="secure-text">Secure checkout powered by Stripe</p>
        </div>

      </div>
    </div>
  );
};

export default Pricing;