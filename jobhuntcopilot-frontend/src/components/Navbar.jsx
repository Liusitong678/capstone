import React, { useContext } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";

import logo from "../assets/logo.svg";
import { AuthContext } from "../firebase/AuthContext";
import { logout } from "../firebase/logout";
import "../styles/navbar.css";

const AppNavbar = () => {
  const navigate = useNavigate();
  const { firebaseUser, role, loading, profile } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return null;

  // Random greetings
  const greetings = [
    "Howdy",
    "Welcome",
    "Welcome back",
    "Hi there",
    "Greetings",
    "Good to see you",
    "Hello",
    "Hey",
    "Glad you're here"
  ];

  // Choose a greeting once
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Get user's first name
  const firstName = profile?.firstName || firebaseUser?.displayName?.split(" ")[0] || "";

  // Two-letter initials
  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return (profile.firstName[0] + profile.lastName[0]).toUpperCase();
    }
    if (firebaseUser?.displayName) {
      const parts = firebaseUser.displayName.split(" ");
      return parts.map(p => p[0]).join("").substring(0, 2).toUpperCase();
    }
    return "U";
  };


  return (
    <Navbar expand="lg" className="new-navbar" sticky="top">
      <Container fluid className="px-4">

        {/* LEFT LOGO */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 brand-title">
          <img src={logo} width="45" height="45" alt="Logo" />
          <span>JobHuntCopilot</span>
        </Navbar.Brand>

        {/* MOBILE: AVATAR or CREATE BUTTON + TOGGLER */}
        <div className="d-flex d-lg-none ms-auto align-items-center gap-2">

          {/* Not logged in */}
          {!firebaseUser && (
            <Button
              as={Link}
              to="/signup"
              className="create-account-btn mobile-create-btn"
            >
              SignUp
            </Button>
          )}

          {/* Logged in */}
          {firebaseUser && (
            <NavDropdown
              align="end"
              id="mobile-avatar-dropdown"
              title={
                <div className={`avatar-circle ${role}`}>
                  {getInitials()}
                  {role === "premium" && <span className="pro-badge">⭐</span>}
                </div>
              }
            >
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}

          {/* Hamburger menu */}
          <Navbar.Toggle
            aria-controls="main-navbar"
            className="navbar-toggle-custom"
          />
        </div>


        {/* CENTER NAV (Collapsible) */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="mx-auto nav-center gap-4">
            <NavLink to="/" end className="nav-item-link">Home</NavLink>
            <NavLink to="/jobs" className="nav-item-link">Jobs</NavLink>
            <NavLink to="/about" className="nav-item-link">About</NavLink>
            <NavLink to="/contact" className="nav-item-link">Contact</NavLink>

            {firebaseUser && role === "free" && (
              <NavLink to="/upgrade" className="nav-item-link upgrade-link">
                Upgrade ⭐
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="d-none d-lg-flex align-items-center ms-auto me-3">

          {/* Not logged in, Show Create Account */}
          {!firebaseUser && (
            <Button
              as={Link}
              to="/signup"
              className="create-account-btn"
            >
              <RiUser3Fill /> Create Account
            </Button>
          )}

          {/* Greeting text */}
          {firebaseUser && (
            <span className="user-greeting">
              {randomGreeting} {firstName}!
            </span>
          )}

          {/* Logged in, Show avatar dropdown */}
          {firebaseUser && (
            <NavDropdown
              align="end"
              id="desktop-avatar-dropdown"
              title={
                <div className={`avatar-circle ${role}`}>
                  {getInitials()}
                  {role === "premium" && <span className="pro-badge">⭐</span>}
                </div>
              }
            >
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </div>


      </Container>
    </Navbar>
  );
};

export default AppNavbar;
