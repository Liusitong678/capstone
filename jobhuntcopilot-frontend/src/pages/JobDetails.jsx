import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button, Container, Badge, Stack, Spinner, Modal,
  Row, Col, Card, Alert, Placeholder
} from "react-bootstrap";

// Icons
import { 
  FaBuilding, FaMapMarkerAlt, FaBriefcase, FaArrowLeft, 
  FaMagic, FaFileAlt, FaCheckCircle, FaExclamationTriangle, 
  FaLightbulb, FaLock, FaCrown 
} from "react-icons/fa";

// API & Context
import { fetchJobById, callScore, createCoverLetter } from "../services/api";
import { AuthContext } from "../firebase/AuthContext";
import AnimatedLoader from "../components/AnimatedLoader";

export default function JobDetails() {
  const { loading: authLoading, profile } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // States
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showCoverModal, setShowCoverModal] = useState(false);

  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const [selectedModel, setSelectedModel] = useState("adaptive_similarity");


  // --- Premium Feature State ---
  const [showPremiumModal, setShowPremiumModal] = useState(false);

 const isPremium = profile?.role === "premium";

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, authLoading]);

  // --- Handlers ---

  const handleGenerateCoverLetter = async () => {
    if (!job) return;

    // --- Premium Check ---
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    try {
      setCoverLoading(true);
      const data = await createCoverLetter({
        jobTitle: job.title,
        jobDescription: job.description 
      });
      setCoverLetter(data.text?.content || data.text || "");
      setShowCoverModal(true);
    } catch (err) {
      alert(err.message || "Failed to generate cover letter.");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!job) return;
    const userResumeUrl = profile?.resumeUrl;

    if (!userResumeUrl) {
      alert("Please upload a resume in your profile first.");
      return;
    }

    try {
      setScoreLoading(true);
      const data = await callScore({
        job: job,
        resumeUrl: userResumeUrl,
        model: isPremium ? selectedModel : "adaptive_similarity"
      });

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

  // --- Loading Skeleton ---
  if (authLoading || loading) {
    return (
      <Container className="py-5" style={{ maxWidth: "900px" }}>
        <Card className="border-0 shadow-sm p-4">
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} size="lg" />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4} /> <Placeholder xs={4} />
            <Placeholder xs={12} className="mt-4" style={{ height: "200px" }} />
          </Placeholder>
        </Card>
      </Container>
    );
  }

  if (!job) return <Container className="py-5 text-center"><h3>Job not found.</h3></Container>;

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Back Button */}
      <Button 
        variant="link" 
        className="text-decoration-none text-muted mb-3 p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back to Jobs
      </Button>

      {/* Main Job Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Header Section */}
        <div className="p-4 border-bottom">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-2 text-dark">{job.title}</h2>
              <div className="d-flex flex-wrap gap-3 text-secondary">
                <span className="d-flex align-items-center">
                  <FaBuilding className="me-1 text-primary" /> {job.company}
                </span>
                {job.location && (
                  <span className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1 text-danger" /> {job.location}
                  </span>
                )}
                {job.level && (
                  <span className="d-flex align-items-center">
                    <FaBriefcase className="me-1 text-success" /> {job.level}
                  </span>
                )}
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <small className="text-muted">Posted {job.date || "Recently"}</small>
            </Col>
          </Row>
        </div>

        {/* Body Section */}
        <Card.Body className="p-4 p-md-5">
          {/* Skills Tags */}
          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="mb-4">
              <h6 className="text-uppercase text-muted fw-bold small mb-2">Required Skills</h6>
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {job.skills.map((s, i) => (
                  <Badge key={i} bg="white" className="text-dark border px-3 py-2 fw-normal">
                    {s}
                  </Badge>
                ))}
              </Stack>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <h6 className="text-uppercase text-muted fw-bold small mb-3">Job Description</h6>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: "#4a4a4a" }}>
              {job.description}
            </div>
          </div>

          {/* Action Area (Floating or Bottom) */}
          <Card className="bg-light border-0 rounded-3 p-4">
            <Row className="align-items-center g-3">
              <Col md={8}>
                <h5 className="fw-bold mb-1">Ready to apply?</h5>
                <p className="text-muted mb-0 small">Use AI to boost your chances.</p>
              </Col>
              <Col md={4} className="d-flex flex-column gap-3">

                {/* Premium-only Model Selector */}
                {isPremium && (
                  <div>
                    <label className="fw-bold small text-muted mb-1">Select Scoring Model</label>
                    <select
                      className="form-select shadow-sm"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="adaptive_similarity">Adaptive Similarity Model (Fast)</option>
                      <option value="gemini">Gemini AI Model (Advanced)</option>
                    </select>
                  </div>
                )}

                {/* Analyze Resume Button */}
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="d-flex align-items-center justify-content-center w-100 shadow-sm"
                  onClick={handleAnalyzeResume}
                  disabled={coverLoading || scoreLoading}
                  style={{ background: "linear-gradient(45deg, rgb(0, 9, 177), rgb(57, 206, 221))", border: "none" }}
                >
                  {scoreLoading ? <Spinner size="sm" /> : <FaMagic className="me-2" />} 
                  {scoreLoading ? " Analyzing..." : "Analyze Match"}
                </Button>

                {/* Cover Letter Button */}
                <div className="position-relative">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="d-flex align-items-center justify-content-center w-100 shadow-sm"
                    onClick={handleGenerateCoverLetter}
                    disabled={coverLoading || scoreLoading}
                    style={{ background: "linear-gradient(45deg, rgb(18, 0, 116), rgb(146, 0, 136))", border: "none" }}
                  >
                    {coverLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      isPremium ? <FaFileAlt className="me-2" /> : <FaLock className="me-2" />
                    )}
                    {coverLoading ? " Writing..." : "Write Cover Letter"}
                  </Button>

                  {!isPremium && (
                    <Badge 
                      bg="warning" 
                      text="dark" 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill shadow-sm"
                      style={{ zIndex: 1 }}
                    >
                      PRO
                    </Badge>
                  )}
                </div>

              </Col>

            </Row>
          </Card>
        </Card.Body>
      </Card>

      {/* --- Modal: Cover Letter --- */}
      <Modal show={showCoverModal} onHide={() => setShowCoverModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <FaFileAlt className="text-primary me-2" /> AI Cover Letter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <div className="p-4 bg-light rounded border" style={{ fontFamily: "'Georgia', serif", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {coverLetter}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowCoverModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => {navigator.clipboard.writeText(coverLetter); alert("Copied!")}}>Copy to Clipboard</Button>
        </Modal.Footer>
      </Modal>

      {/* --- Modal: Premium Upsell --- */}
      <Modal show={showPremiumModal} onHide={() => setShowPremiumModal(false)} size="md" centered>
        <Modal.Body className="text-center p-5">
            <div className="mb-4">
                <span className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle" style={{ width: '80px', height: '80px' }}>
                    <FaCrown size={40} />
                </span>
            </div>
            <h3 className="fw-bold mb-3">Unlock AI Cover Letters</h3>
            <p className="text-muted mb-4">
                Generate tailored, professional cover letters instantly for any job description. 
                Upgrade to Premium to access this feature and stand out from the crowd!
            </p>
            <div className="d-grid gap-2">
                <Button 
                    variant="warning" 
                    size="lg" 
                    className="fw-bold text-dark"
                    onClick={() => navigate('/upgrade')} // Adjust route to your pricing page
                >
                    Upgrade to Premium
                </Button>
                <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowPremiumModal(false)}>
                    Maybe Later
                </Button>
            </div>
        </Modal.Body>
      </Modal>

      {/* --- Loading Overlay --- */}
      {scoreLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(31, 31, 39, 0.75)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedLoader />
          <h4 className="mt-4 text-light fw-bold">Analyzing Resume Match...</h4>
        </div>
      )}

      {/* --- Modal: AI Score Result --- */}
      <Modal show={showScoreModal} onHide={() => setShowScoreModal(false)} size="xl" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Match Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-5">
          {scoreResult && (
            <Container fluid>
              {/* Score Dashboard */}
              <Row className="align-items-center mb-4 g-4">
                <Col md={4} className="text-center">
                  <div style={{ width: "150px", height: "150px", margin: "0 auto" }} className="position-relative d-flex align-items-center justify-content-center">
                    <svg viewBox="0 0 36 36" className="d-block w-100">
                      <path
                        className="text-light"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className={`text-${getScoreVariant(scoreResult.score)}`}
                        strokeDasharray={`${scoreResult.score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <h1 className="position-absolute fw-bold mb-0">{scoreResult.score}%</h1>
                  </div>
                  <div className="mt-2 text-muted fw-bold">Match Score</div>
                </Col>
                
                <Col md={8}>
                   <Alert variant="light" className="border-0 shadow-sm d-flex gap-3">
                     <FaLightbulb className="text-warning fs-3 flex-shrink-0" />
                     <div>
                       <h6 className="fw-bold text-dark">AI Feedback</h6>
                       <p className="mb-0 text-secondary">{scoreResult.feedback}</p>
                     </div>
                   </Alert>
                </Col>
              </Row>

              {/* Side by Side Comparison */}
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Header className="bg-success bg-opacity-10 text-success fw-bold border-0 py-3">
                      <FaCheckCircle className="me-2" /> Skills You Have
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-wrap gap-2">
                        {scoreResult.matched?.length > 0 ? (
                          scoreResult.matched.map((skill, i) => (
                            <Badge key={i} bg="success" className="py-2 px-3 fw-normal">{skill}</Badge>
                          ))
                        ) : (
                          <span className="text-muted fst-italic">No exact keyword matches found.</span>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Header className="bg-danger bg-opacity-10 text-danger fw-bold border-0 py-3">
                      <FaExclamationTriangle className="me-2" /> Missing Keywords
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-wrap gap-2">
                        {scoreResult.missing?.length > 0 ? (
                          scoreResult.missing.map((skill, i) => (
                            <Badge key={i} bg="light" text="dark" className="border py-2 px-3 fw-normal">{skill}</Badge>
                          ))
                        ) : (
                          <span className="text-success fw-bold">Perfect! No critical skills missing.</span>
                        )}
                      </div>
                      <div className="mt-3 small text-muted">
                        * Consider adding these keywords to your resume if you have this experience.
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}