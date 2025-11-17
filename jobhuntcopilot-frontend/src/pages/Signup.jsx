import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

import logo from "../assets/logo2.svg";
import bg from "../assets/bg-login.jpg";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 将 Firebase 错误转成人话（可按需扩展）
  const prettyError = (code = "") => {
    if (code.includes("email-already-in-use")) return "This email is already registered.";
    if (code.includes("invalid-email")) return "Please enter a valid email address.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    return "Sign up failed. Please try again.";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); 
    } catch (err) {
      setError(prettyError(err?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrap" style={{ backgroundImage: `url(${bg})` }}>
      <Container className="auth-container">
        <Card className="p-4 shadow-sm login-card">
          <div className="brand">
            <div className="brand-icon">
              <img src={logo} alt="Logo" className="brand-logo" />
            </div>
            <h3 className="brand-title">Create Account</h3>
            <p className="brand-subtitle">Join JobHunt Copilot</p>
          </div>

          {error && (
            <Alert variant="danger" className="auth-alert">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSignup} className="auth-form">
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Email address</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Password (min 6 chars)</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                minLength={6}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="auth-label">Confirm password</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Form.Group>

            <div className="auth-actions">
              <Button
                type="submit"
                className="auth-btn"
                disabled={loading}
                variant="primary"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
              </Button>
            </div>

            <p className="auth-note">
              Already have an account?{" "}
              <Link to="/login" className="link-strong">
                Login
              </Link>
            </p>
          </Form>
        </Card>
      </Container>

      <div className="bg-bubble b1" />
      <div className="bg-bubble b2" />
      <div className="bg-bubble b3" />
    </div>
  );
};

export default Signup;
