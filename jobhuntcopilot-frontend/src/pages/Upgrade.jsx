import React, { useEffect, useState } from "react";
import "../styles/upgrade.css";

const UpgradePage = () => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free"); // "free" | "pro"
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  // Placeholder: fetch current user + plan from backend
  const fetchUserPlan = async () => {
    try {
      setLoading(true);
      setError("");

      // TODO: replace with your real API endpoint, e.g. /api/auth/me
      const res = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await res.json();

      // If backend doesn't have plan yet, treat as "free"
      setPlan(data.plan || "free");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load your membership status. Please try again later."
      );
      setPlan("free");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlan();
  }, []);

  // Click “Upgrade” → create checkout session (Stripe or other)
  const handleUpgrade = async () => {
    try {
      setPaying(true);
      setError("");

      // TODO: replace this URL with your real backend payment route
      const res = await fetch(
        "http://localhost:3000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            // Placeholder payload – later you can pass userId, planType, etc.
            amount: 1999, // 19.99 CAD in cents
            planType: "Copilot Pro",
          }),
        }
      );

      const data = await res.json();

      if (!data.url) {
        throw new Error("No checkout URL received from server");
      }

      // Redirect to Stripe Checkout (or any payment page)
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError("Could not start the payment process. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="upgrade-page">
        <div className="upgrade-card">
          <p>Loading your membership status…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-page">
      {/* Hero / header */}
      <div className="upgrade-hero">
        <div>
          <h1 className="hero-title">Upgrade to JobHunt Copilot Pro</h1>
          <p className="hero-subtitle">
            Unlock more powerful AI tools to organize your job search, analyze
            roles, and stay ahead of other candidates.
          </p>
        </div>
        <div className="hero-badge">Upgrade ★</div>
      </div>

      {/* Main card */}
      <div className="upgrade-card">
        {error && <div className="error-box">{error}</div>}

        {plan === "free" && (
          <>
            {/* Status */}
            <div className="status-row">
              <span className="status-label">Current plan</span>
              <span className="badge-free">Free</span>
            </div>

            <p className="upgrade-text">
              You’re currently using the <strong>Free</strong> version of
              JobHunt Copilot. It’s great for getting started, but it has
              limited AI usage and fewer organizing features.
            </p>

            <ul className="upgrade-list">
              <li>Limited number of AI analysis calls per day (placeholder).</li>
              <li>Basic job recommendations and saved jobs (placeholder).</li>
              <li>No advanced insights or bulk job comparison yet (placeholder).</li>
            </ul>

            {/* Pricing + button */}
            <div className="price-box">
              <div>
                <p className="price-label">Copilot Pro</p>
                <p className="price-value">
                  $19.99 <span className="price-period">/ month</span>
                </p>
                <p className="price-hint">(Price is just a placeholder.)</p>
              </div>

              <button
                className={`upgrade-btn ${paying ? "btn-disabled" : ""}`}
                onClick={handleUpgrade}
                disabled={paying}
              >
                {paying ? "Redirecting to payment…" : "Upgrade to Copilot Pro"}
              </button>
            </div>

            <p className="upgrade-note">
              When you click “Upgrade”, we’ll redirect you to a secure payment
              page (e.g. Stripe in test mode). After a successful payment, your
              account will be marked as Pro and additional features will be
              unlocked. For the capstone, this can stay as a test/placeholder
              implementation.
            </p>
          </>
        )}

        {plan === "pro" && (
          <>
            <div className="status-row">
              <span className="status-label">Current plan</span>
              <span className="badge-pro">Pro</span>
            </div>

            <p className="upgrade-text">
              Thanks for upgrading! Your account is now on{" "}
              <strong>JobHunt Copilot Pro</strong>.
            </p>
            <p className="upgrade-text">
              The section below shows placeholder Pro features. Later, you can
              connect this page to your real AI limits, saved data, or
              additional dashboards.
            </p>

            <h3 className="features-title">
              What you get with Copilot Pro (Placeholder)
            </h3>

            <ul className="upgrade-list">
              <li>
                <strong>Deeper AI job analysis</strong> – richer insights for
                each job posting (placeholder).
              </li>
              <li>
                <strong>More AI credits</strong> – higher daily or monthly usage
                limits for resume / JD analysis (placeholder).
              </li>
              <li>
                <strong>Saved job profiles &amp; history</strong> – keep more
                saved roles and AI reports (placeholder).
              </li>
              <li>
                <strong>Priority processing</strong> – faster AI responses for
                Pro users (placeholder).
              </li>
            </ul>

            <p className="features-note">
              * These are placeholder descriptions. You can replace them later
              with the exact premium features you decide to implement.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UpgradePage;
