import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import logo from "../assets/logo2.svg";
import bg from "../assets/bg-login.jpg";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import "../styles/auth.css"; 

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page-wrap" style={{ backgroundImage: `url(${bg})` }}>
      <Container className="auth-container">
        <Card className="p-4 shadow-sm login-card">
          <div className="brand">
            <div className="brand-icon">
                <img src={logo} alt="Logo" className="brand-logo" />
            </div>
            <h3 className="brand-title">JobHunt Copilot</h3>
            <p className="brand-subtitle">Sign in to continue</p>
          </div>

          {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

          <Form onSubmit={handleLogin} className="auth-form">
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Email address</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                required
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="auth-label">Password</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                value={password}
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="auth-actions">
              <Button
                type="submit"
                className="auth-btn"
                disabled={loading}
                variant="primary"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>
            </div>

            <p className="auth-note">
              Don't have an account? <Link to="/signup" className="link-strong">Create one</Link>
            </p>
          </Form>
        </Card>
      </Container>

      {/* 可选：背景装饰 */}
      <div className="bg-bubble b1" />
      <div className="bg-bubble b2" />
      <div className="bg-bubble b3" />
    </div>
  );
};

export default Login;
