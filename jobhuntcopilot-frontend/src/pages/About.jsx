import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <div className="py-5 bg-light">
      <Container>
        {/* Header Section */}
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h1 className="fw-bold mb-3 text-primary">About JobHuntCopilot</h1>
            <p className="lead text-muted">
              JobHuntCopilot is an AI-powered job assistance platform designed
              to help candidates discover relevant opportunities, analyze
              resume–job compatibility, and generate personalized cover letters
              — all in one streamlined experience.
            </p>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4359/4359716.png"
              alt="AI-powered job assistant illustration"
              className="img-fluid rounded-3 shadow-sm"
            />
          </Col>
          <Col lg={6}>
            <h3 className="fw-semibold text-secondary mb-3">Our Mission</h3>
            <p className="text-muted">
              Our mission is to simplify and enhance the job search process by
              combining automation, data-driven analysis, and AI intelligence.
              Whether you are a student, professional, or recruiter, JobHuntCopilot
              aims to reduce the time spent on manual research and help you make
              smarter career moves.
            </p>
          </Col>
        </Row>

        {/* Technology Stack */}
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h3 className="fw-semibold text-secondary mb-3">
              Powered by Modern Technology
            </h3>
            <p className="text-muted">
              JobHuntCopilot is built using a full-stack JavaScript ecosystem:
            </p>
            <ul className="list-inline">
              <li className="list-inline-item mx-2 badge bg-primary">
                React + Vite
              </li>
              <li className="list-inline-item mx-2 badge bg-success">
                Node.js + Express
              </li>
              <li className="list-inline-item mx-2 badge bg-info text-dark">
                MongoDB Atlas
              </li>
              <li className="list-inline-item mx-2 badge bg-warning text-dark">
                OpenAI API
              </li>
              <li className="list-inline-item mx-2 badge bg-dark">
                n8n Automation
              </li>
            </ul>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h3 className="fw-semibold text-secondary mb-3">Meet the Team</h3>
          </Col>
        </Row>
        <Row className="justify-content-center text-center">
          {[
            { name: "Riwaj Shrestha", role: "Backend & AI" },
            { name: "Sitong Liu", role: "Backend" },
            { name: "Aswathy Chandran Kala", role: "Frontend" },
            { name: "Niravkumar Rajeshbhai Bavadiya", role: "Frontend" },
          ].map((member, index) => (
            <Col key={index} lg={3} md={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div
                    className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <Card.Title className="mb-1">{member.name}</Card.Title>
                  <Card.Text className="text-muted small">{member.role}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Footer Section */}
        <Row className="mt-5">
          <Col className="text-center text-muted small">
            <p>
              © {new Date().getFullYear()} JobHuntCopilot | Built for Conestoga College Capstone Project
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
