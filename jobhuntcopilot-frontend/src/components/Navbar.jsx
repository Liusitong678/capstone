import React, { useContext } from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";
import { AuthContext } from "../firebase/AuthContext";
import { logout } from "../firebase/logout";
import PremiumBadge from "./PremiumBadge";

const AppNavbar = () => {
  const navigate = useNavigate();
  const { firebaseUser, role, loading } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return null; // prevent wrong UI flashing


  return (
      <Navbar expand="lg" variant="dark" className="custom-navbar py-3" sticky="top">
        <Container fluid className="px-5">

          {/* Brand / Logo */}
          <Navbar.Brand
              as={Link}
              to="/"
              className="fw-bold fs-4 text-white d-flex align-items-center"
          >
            <img src={logo} width="50" className="me-2" alt="JobHuntCopilot Logo" />
            JobHuntCopilot

          </Navbar.Brand>

          {/* Mobile Toggler */}
          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="align-items-center gap-4">

              <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
              >
                Home
              </NavLink>

              {firebaseUser && (
                  <NavLink
                      to="/profile"
                      className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                  >
                    Profile
                  </NavLink>
              )}

              <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
              >
                About
              </NavLink>

              {/* SHOW UPGRADE LINK IF FREE USER */}
              {firebaseUser && role === "free" && (
                  <NavLink
                      to="/upgrade"
                      className={({ isActive }) =>
                          isActive ? "nav-link active-link text-warning" : "nav-link text-warning"
                      }
                  >
                    Upgrade
                  </NavLink>
              )}

              {/* AUTH BUTTONS */}
              {!firebaseUser && !loading && (
                  <>
                    <Button
                        as={Link}
                        to="/login"
                        variant="outline-light"
                        className="px-3 py-1"
                    >
                      Login
                    </Button>
                    <Button
                        as={Link}
                        to="/signup"
                        variant="light"
                        className="px-3 py-1 fw-semibold"
                    >
                      Sign Up
                    </Button>
                  </>
              )}

              {firebaseUser && (
                  <Button
                      variant="outline-light"
                      className="px-3 py-1"
                      onClick={handleLogout}
                  >
                    Logout
                  </Button>
              )}

              {firebaseUser && (
                <div className="d-flex align-items-center ms-3">
                  <PremiumBadge role={role} />
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default AppNavbar;
