import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import "../styles/payment.css";

const PaymentCancel = () => {
  return (
    <div className="payment-wrapper cancel">
      <FaTimesCircle className="icon cancel-icon" />
      <h1>Payment Canceled</h1>
      <p>No worries — you can upgrade anytime.</p>
      <a href="/upgrade" className="btn-back">
        Try Again
      </a>
    </div>
  );
};

export default PaymentCancel;
