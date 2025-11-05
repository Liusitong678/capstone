import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const AppNavbar = () => {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="custom-navbar py-3"
      sticky="top"
    >
      <Container fluid className="px-5">
        {/* Brand / Logo */}
        <Navbar.Brand
          href="/"
          className="fw-bold fs-4 text-white"
        >
          JobHuntCopilot
        </Navbar.Brand>

        {/* Toggler for Mobile */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Menu Items */}
        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          <Nav className="align-items-center gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              About
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
