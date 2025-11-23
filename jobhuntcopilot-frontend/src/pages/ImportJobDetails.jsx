import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Badge,
  Spinner,
  Modal,
  Row,
  Col,
  Card,
  Alert,
  Placeholder,
} from "react-bootstrap";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowLeft,
  FaMagic,
  FaFileAlt,
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  callScore,
  createCoverLetter,
  fetchJobDescription,
} from "../services/api";
import { AuthContext } from "../firebase/AuthContext";

export default function ImportJobDetails() {
  const { profile } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(location.state?.job || null);

  // Loading States
  const [descLoading, setDescLoading] = useState(true);
  const [coverLoading, setCoverLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);

  // Result States
  const [coverLetter, setCoverLetter] = useState("");
  const [scoreResult, setScoreResult] = useState(null);

  // Modal Visibility
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Redirect if no job data
  useEffect(() => {
    if (!job) {
      navigate("/import-jobs");
    }
  }, [job, navigate]);

  // Scrape the Details Page
  useEffect(() => {
    if (job && job.link) {
      const loadDetails = async () => {
        try {
          setDescLoading(true);

          // Call the Backend AI Scraper
          const res = await fetchJobDescription(job.link);

          // Update job with scraped details
          setJob((prev) => ({
            ...prev,
            description: res.description,
            skills: res.skills || [],
            level: res.level || prev.level,
            salary: res.salary || "Not disclosed",
            company: res.company || prev.company,
            title: res.title || prev.title,
          }));
        } catch (err) {
          console.error("Failed to load details:", err);
        } finally {
          setDescLoading(false);
        }
      };
      loadDetails();
    } else {
      setDescLoading(false);
    }
  }, []); // Run once on mount

  if (!job) return null;

  // --- Handlers ---
  // Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    try {
      setCoverLoading(true);
      const data = await createCoverLetter({ job });
      setCoverLetter(data.text?.content || data.text || "");
      setShowCoverModal(true);
    } catch (err) {
      alert(err.message || "Failed to generate cover letter.");
    } finally {
      setCoverLoading(false);
    }
  };

  // Analyze Resume Match
  const handleAnalyzeResume = async () => {
    if (!profile?.resumeUrl) {
      alert("Please upload a resume in your profile first.");
      return;
    }
    try {
      setScoreLoading(true);
      const data = await callScore({ job, resumeUrl: profile.resumeUrl });
      setScoreResult(data);
      setShowScoreModal(true);
    } catch (err) {
      alert(err.message || "Failed to analyze resume.");
    } finally {
      setScoreLoading(false);
    }
  };

  const getScoreVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Back Button */}
      <Button
        variant="link"
        className="text-decoration-none text-muted mb-3 p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back to Imported List
      </Button>

      {/* Main Job Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Header Section */}
        <div className="p-4 border-bottom bg-light">
          <Row className="align-items-start">
            <Col md={9}>
              <h2 className="fw-bold mb-2 text-dark">{job.title}</h2>

              <div className="d-flex flex-wrap gap-3 text-secondary mb-3">
                <span className="d-flex align-items-center">
                  <FaBuilding className="me-1 text-primary" />{" "}
                  {job.company || "Unknown"}
                </span>

                {job.location && (
                  <span className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1 text-danger" />{" "}
                    {job.location}
                  </span>
                )}

                {job.level && (
                  <span className="d-flex align-items-center">
                    <FaBriefcase className="me-1 text-success" /> {job.level}
                  </span>
                )}

                {/* Salary */}
                {job.salary && job.salary !== "Not disclosed" && (
                  <span className="d-flex align-items-center text-dark fw-bold badge bg-white border text-dark">
                    💰 {job.salary}
                  </span>
                )}
              </div>

              {/* Skills */}
              {!descLoading && job.skills && job.skills.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      bg="white"
                      text="dark"
                      className="border fw-normal px-2 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </Col>

            <Col md={3} className="text-md-end mt-3 mt-md-0">
              <Button
                href={job.link}
                target="_blank"
                variant="outline-secondary"
                size="sm"
                className="d-flex align-items-center justify-content-center w-100"
              >
                <FaExternalLinkAlt className="me-2" /> Original Post
              </Button>
            </Col>
          </Row>
        </div>

        <Card.Body className="p-4 p-md-5">
          {/* Description Section with Skeleton */}
          <div className="mb-5">
            <h6 className="text-uppercase text-muted fw-bold small mb-3">
              Job Description
            </h6>

            {descLoading ? (
              <Placeholder animation="glow">
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={10} className="mb-2" />
                <Placeholder xs={8} className="mb-4" />
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={11} className="mb-2" />
                <Placeholder xs={9} className="mb-2" />
              </Placeholder>
            ) : (
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  color: "#4a4a4a",
                }}
              >
                {job.description ||
                  "Description could not be retrieved. Please view the original post."}
              </div>
            )}
          </div>

          {/* Action Area */}
          <Card className="bg-light border-0 rounded-3 p-4">
            <Row className="align-items-center g-3">
              <Col md={7}>
                <h5 className="fw-bold mb-1">Ready to apply?</h5>
                <p className="text-muted mb-0 small">
                  Use AI to compare your resume or write a cover letter.
                </p>
              </Col>
              <Col md={5} className="d-flex flex-column gap-2">
                <Button
                  size="lg"
                  className="d-flex align-items-center justify-content-center w-100 shadow-sm text-white"
                  onClick={handleAnalyzeResume}
                  disabled={descLoading || coverLoading || scoreLoading}
                  style={{
                    background:
                      "linear-gradient(45deg, rgb(0, 9, 177), rgb(57, 206, 221))",
                    border: "none",
                  }}
                >
                  {scoreLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <FaMagic className="me-2" />
                  )}
                  {scoreLoading ? " Analyzing..." : "Analyze Match"}
                </Button>

                <Button
                  size="lg"
                  className="d-flex align-items-center justify-content-center w-100 shadow-sm text-white"
                  onClick={handleGenerateCoverLetter}
                  disabled={descLoading || coverLoading || scoreLoading}
                  style={{
                    background:
                      "linear-gradient(45deg, rgb(18, 0, 116), rgb(146, 0, 136))",
                    border: "none",
                  }}
                >
                  {coverLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <FaFileAlt className="me-2" />
                  )}
                  {coverLoading ? " Writing..." : "Write Cover Letter"}
                </Button>
              </Col>
            </Row>
          </Card>
        </Card.Body>
      </Card>

      {/* --- Modal: Cover Letter --- */}
      <Modal
        show={showCoverModal}
        onHide={() => setShowCoverModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>AI Cover Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          <pre
            style={{ fontFamily: "'Georgia', serif", whiteSpace: "pre-wrap" }}
          >
            {coverLetter}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCoverModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigator.clipboard.writeText(coverLetter);
              alert("Copied!");
            }}
          >
            Copy to Clipboard
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Modal: Match Analysis --- */}
      <Modal
        show={showScoreModal}
        onHide={() => setShowScoreModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Match Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {scoreResult && (
            <Container fluid>
              {/* Score Header */}
              <Row className="align-items-center mb-4">
                <Col md={3} className="text-center">
                  <div className="position-relative d-inline-block">
                    <h1
                      className={`display-3 fw-bold text-${getScoreVariant(
                        scoreResult.score
                      )}`}
                    >
                      {scoreResult.score}%
                    </h1>
                  </div>
                  <div className="text-muted fw-bold">Match Score</div>
                </Col>
                <Col md={9}>
                  <Alert variant="info" className="d-flex align-items-start">
                    <FaLightbulb className="me-3 mt-1 fs-4 flex-shrink-0" />
                    <div>
                      <strong>AI Feedback:</strong> <br />
                      {scoreResult.feedback}
                    </div>
                  </Alert>
                </Col>
              </Row>

              {/* Comparison Columns */}
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="h-100 border-success shadow-sm">
                    <Card.Header className="bg-success text-white fw-bold">
                      <FaCheckCircle className="me-2" /> Matched Skills
                    </Card.Header>
                    <Card.Body>
                      {scoreResult.matched?.length > 0 ? (
                        scoreResult.matched.map((s, i) => (
                          <Badge key={i} bg="success" className="me-1 mb-1 p-2">
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No direct matches.</span>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="h-100 border-danger shadow-sm">
                    <Card.Header className="bg-danger text-white fw-bold">
                      <FaExclamationTriangle className="me-2" /> Missing
                      Keywords
                    </Card.Header>
                    <Card.Body>
                      {scoreResult.missing?.length > 0 ? (
                        scoreResult.missing.map((s, i) => (
                          <Badge
                            key={i}
                            bg="light"
                            text="dark"
                            className="me-1 mb-1 p-2 border"
                          >
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-success">Perfect match!</span>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScoreModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
