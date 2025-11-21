import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

import logo from "../assets/logo2.svg";
import bg from "../assets/bg-login.jpg";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      setLoading(false);
      return;
    }

    try {
      // Create Firebase user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase displayName
      await updateProfile(userCred.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Save user profile in MongoDB via backend
      const token = await userCred.user.getIdToken();

      const createProfileResponse = await fetch("/api/users/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      });

      if (!createProfileResponse.ok) {
        const data = await createProfileResponse.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create profile. Try again.");
      }
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
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

            {/* FIRST NAME */}
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">First Name</Form.Label>
              <Form.Control
                className="auth-input"
                type="text"
                required
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            {/* LAST NAME */}
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Last Name</Form.Label>
              <Form.Control
                className="auth-input"
                type="text"
                required
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            {/* EMAIL */}
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

            {/* PASSWORD */}
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

            {/* CONFIRM PASSWORD */}
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
              <Button type="submit" className="auth-btn" disabled={loading} variant="primary">
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
