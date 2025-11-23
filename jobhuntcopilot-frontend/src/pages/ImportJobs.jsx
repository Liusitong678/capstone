import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaLink, FaMapMarkerAlt, FaBriefcase, FaEye } from "react-icons/fa";
import heroImg from "../assets/hero-dashboard.png"; 
import { parseJobs } from "../services/api"; 
import "../styles/dashboard.css"; 

export default function ImportJobs() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true); setError(""); setJobs([]);

    try {
      const res = await parseJobs(url);
      if (res.jobs && res.jobs.length > 0) setJobs(res.jobs);
      else setError("No jobs found. The page might use complex JavaScript or require login.");
    } catch (err) {
      setError("Failed to fetch jobs. Ensure the URL is correct.");
        console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate to Details Page passing Data
  const handleSeeDetails = (job) => {
    navigate("imported-job-details", { state: { job } });
  };

  return (
    <div className="rb-root">
      <div className="rb-toolbar">
        <Container className="rb-hero">
          <div className="rb-hero-left">
            <h1 className="rb-hero-title">Universal Job Importer</h1>
            <p className="rb-hero-subtitle">Paste a career page link to import jobs.</p>
            <Form onSubmit={handleFetch} className="rb-search-shell">
              <div className="rb-search-block rb-search-keyword" style={{ flex: 1 }}>
                <span className="rb-search-icon"><FaLink /></span>
                <Form.Control className="rb-search-input" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <Button type="submit" className="rb-search-btn" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Fetch Jobs"}
              </Button>
            </Form>
          </div>
          <div className="rb-hero-right floating-illustration"><img src={heroImg} alt="Job hunter" className="rb-hero-illustration" /></div>
        </Container>
      </div>

      <Container fluid className="rb-content">
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && jobs.length === 0 && !error && (
           <div className="text-center text-muted py-5"><h4>Ready to Import</h4></div>
        )}

        <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
          {jobs.map((job, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm border-0 rounded-4 transition-card">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1 text-truncate" title={job.title}>{job.title}</h5>
                    <div className="text-muted small mb-2">{job.company || "Unknown"}</div>
                    <div className="d-flex flex-wrap gap-2">
                      {job.location && <Badge bg="light" text="dark" className="border fw-normal"><FaMapMarkerAlt className="me-1"/> {job.location}</Badge>}
                      <Badge bg="light" text="dark" className="border fw-normal"><FaBriefcase className="me-1"/> Full-time</Badge>
                    </div>
                  </div>
                  
                  {/* Spacer */}
                  <div className="mt-auto pt-3">
                    {/* ✅ ONLY ONE BUTTON NOW */}
                    <Button 
                      variant="outline-primary" 
                      className="w-100 d-flex align-items-center justify-content-center"
                      onClick={() => handleSeeDetails(job)}
                    >
                      <FaEye className="me-2" /> See Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}