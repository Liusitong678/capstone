import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <Container>

        <Row className="text-center text-md-start">

          {/* Left Section */}
          <Col md={4} className="mb-4">
            <h5 className="footer-title">JobHuntCopilot</h5>
            <p className="footer-text">
              Your AI assistant that helps you apply smarter, faster, and with confidence.
            </p>
            <small className="footer-tagline">🚀 Built with AI + Love</small>
          </Col>

          {/* Middle Links */}
          <Col md={4} className="mb-4">
            <h6 className="footer-subtitle">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/upgrade">Upgrade</Link></li>
            </ul>
          </Col>

          {/* Right Contact + Social */}
          <Col md={4}>
            <h6 className="footer-subtitle">Get in Touch</h6>
            <p className="footer-text">support@jobhuntcopilot.com</p>
            <p className="footer-text">Toronto, Canada</p>

            <div className="footer-social mt-2">
              <Link to="/" className="footer-icon"><Facebook size={20} /></Link>
              <Link to="/" className="footer-icon"><Instagram size={20} /></Link>
              <Link to="/" className="footer-icon"><Linkedin size={20} /></Link>
              <Link to="/" className="footer-icon"><Twitter size={20} /></Link>
            </div>
          </Col>

        </Row>

        {/* Bottom Copyright */}
        <Row>
          <Col className="text-center mt-3">
            <small className="footer-copy">
              © {new Date().getFullYear()} JobHuntCopilot — All Rights Reserved.
            </small>
          </Col>
        </Row>

      </Container>
    </footer>
  );
}
