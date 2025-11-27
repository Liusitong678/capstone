// src/pages/Upgrade.jsx
import React, { useState } from "react";
import { FiCheckCircle, FiXCircle, FiZap, FiStar } from "react-icons/fi";
import { useAuth } from "../firebase/useAuth";
import { createCheckoutSession } from "../services/api";
import "../styles/upgrade.css";

const Upgrade = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
  try {
    setLoading(true);
    const res = await createCheckoutSession();
    window.location.href = res.url; // Stripe checkout URL
  } catch (err) {
    console.error("Upgrade failed:", err);
    alert("Failed to redirect to Stripe. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upgrade-wrapper">
      {/* HERO SECTION */}
      <div className="upgrade-hero">
        <h1 className="upgrade-title">
          Unlock Your Full Potential with <span>Premium</span>
        </h1>
        <p className="upgrade-subtitle">
          Level up your job search with AI-powered scoring, personalized insights, 
          and advanced tools designed to get you hired faster.
        </p>
      </div>

      {/* PRICING CARD */}
      <div className="pricing-container">
        <div className="pricing-card">
          <div className="pricing-header">
            <FiStar className="premium-icon" />
            <h2 className="plan-title">Premium Plan</h2>
            <p className="plan-price">
              <span>$4.99</span> / month
            </p>
          </div>

          {/* FEATURES */}
          <div className="features-list">
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              AI Resume Scoring & Job Match %
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Unlimited Resume Uploads
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              AI Cover Letter Generator
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Faster Job Search Results
            </div>
            <div className="feature">
              <FiCheckCircle className="check-icon" />
              Priority Feature Access
            </div>

            <div className="feature-disabled">
              <FiXCircle className="cross-icon" />
              No Ads, No Distractions
            </div>
          </div>

          {/* CTA BUTTON */}
          <button
            className="upgrade-btn"
            onClick={handleUpgrade}
            disabled={loading || role === "premium"}
          >
            {role === "premium" ? (
              "You Already Have Premium"
            ) : loading ? (
              "Redirecting…"
            ) : (
              <>
                <FiZap className="zap-icon" /> Upgrade to Premium
              </>
            )}
          </button>

          {/* SMALL FOOTER TEXT */}
          <p className="secure-text">Secure checkout powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
