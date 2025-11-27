import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/payment.css";

const PaymentSuccess = () => {
  return (
    <div className="payment-wrapper success">
      <FaCheckCircle className="icon success-icon" />
      <h1>Payment Successful!</h1>
      <p>Your Premium membership is now active.</p>
      <a href="/upgrade" className="btn-back">
        Return to Upgrade Page
      </a>
    </div>
  );
};

export default PaymentSuccess;
