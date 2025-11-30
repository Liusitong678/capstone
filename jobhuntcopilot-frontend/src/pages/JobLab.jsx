import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  FaRobot,
  FaPaperPlane,
  FaFlask,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaFilePdf,
} from "react-icons/fa";

import { AuthContext } from "../firebase/AuthContext";
import { callScore, chatWithCareerCoach } from "../services/api";
import "../styles/dashboard.css";
import AnimatedLoader from "../components/AnimatedLoader";

export default function JobLab() {
  const { profile } = useContext(AuthContext);

  // Inputs
  const [jobDesc, setJobDesc] = useState("");
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl || "");

  // Premium user check
  const isPremium = profile?.role === "premium";

  // Model selection for premium users
  const [selectedModel, setSelectedModel] = useState("adaptive_similarity");

  // States
  const [analyzing, setAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState("");

  // Chat States
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Analyze Job Description vs Resume
  const handleAnalyze = async () => {
    if (!jobDesc) return setError("Please paste a job description.");

    setAnalyzing(true);
    setError("");
    setScoreData(null);

    try {
      const mockJobPayload = jobDesc;

      // Call Scoring API with model selection
      const res = await callScore({
        job: mockJobPayload,
        resumeUrl: profile.resumeUrl,
        model: isPremium ? selectedModel : "adaptive_similarity",
      });

      setScoreData(res);

      // Initialize Chat
      setMessages([
        {
          sender: "bot",
          text: `I've analyzed your match. You scored ${res.score}%. What would you like to explore?`,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Chat Message Send
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newHistory = [...messages, { text: inputMsg, sender: "user" }];
    setMessages(newHistory);
    setInputMsg("");
    setChatLoading(true);

    try {
      const res = await chatWithCareerCoach({
        messages: newHistory,
        jobDescription: jobDesc,
        resumeText: "Resume text context",
      });

      setMessages([...newHistory, { text: res.reply, sender: "bot" }]);
    } catch (err) {
      setMessages([
        ...newHistory,
        { text: "Error connecting to AI.", sender: "bot" },
      ]);
      console.error("Chat error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper for Score Color
  const getScoreVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  return (
    <div className="rb-root">
      {/* Hero Header */}
      <div className="rb-toolbar mb-4">
        <Container className="rb-hero py-5">
          <div className="rb-hero-left">
            <h1 className="rb-hero-title">
              <FaFlask className="me-2" /> Job Relevance Analyzer
            </h1>
            <p className="rb-hero-subtitle">
              Paste any job description below to test your resume instantly.
            </p>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="g-4">
          {/* The Lab Bench (Inputs) */}
          <Col lg={5}>
            <Card className="shadow-sm border-0 h-100 rounded-4">
              <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">🔬 Experiment Setup</h5>
              </Card.Header>

              <Card.Body className="px-4 pb-4">
                {/* Resume Selector */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted small text-uppercase">
                    Active Resume
                  </Form.Label>
                  <div className="p-3 bg-light rounded border d-flex align-items-center">
                    <FaFilePdf className="text-danger fs-4 me-3" />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-bold text-truncate">
                        {profile?.resumeUrl || "My Resume.pdf"}
                      </div>
                      <div className="small text-muted">Uploaded to Profile</div>
                    </div>
                  </div>
                </Form.Group>

                {/* Job Description Input */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted small text-uppercase">
                    Target Job Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    placeholder="Paste the full job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="border-0 bg-light p-3"
                    style={{ resize: "none", fontSize: "0.9rem" }}
                  />
                </Form.Group>

                {/* PREMIUM: MODEL SELECTOR */}
                {isPremium && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted small text-uppercase">
                      Select Scoring Model
                    </Form.Label>
                    <Form.Select
                      className="shadow-sm"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="adaptive_similarity">Adaptive Similarity Model (Fast)</option>
                      <option value="gemini">Gemini AI Model (Advanced)</option>
                    </Form.Select>
                  </Form.Group>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {/* RUN ANALYSIS */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 py-3 fw-bold shadow-sm"
                  onClick={handleAnalyze}
                  disabled={analyzing || !jobDesc}
                  style={{
                    background: "linear-gradient(45deg, #4e54c8, #8f94fb)",
                    border: "none",
                  }}
                >
                  {analyzing ? (
                    <>
                      <Spinner size="sm" className="me-2" /> Analyzing...
                    </>
                  ) : (
                    "Run Analysis"
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SIDE – RESULTS + CHAT */}
          <Col lg={7}>
            {!scoreData ? (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center p-5 border rounded-4 bg-light text-muted opacity-50">
                <FaFlask size={60} className="mb-3" />
                <h4>Ready to Experiment</h4>
                <p>Paste a job description to see your resume match.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 h-100">
                {/* Score Card */}
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={4} className="text-center border-end">
                        <h1
                          className={`display-3 fw-bold text-${getScoreVariant(
                            scoreData.score
                          )} mb-0`}
                        >
                          {scoreData.score}%
                        </h1>
                        <small className="text-muted fw-bold">
                          MATCH SCORE
                        </small>
                        <div className="mt-1 small text-muted">
                          Model: {scoreData.modelUsed || "adaptive_similarity"}
                        </div>
                      </Col>

                      <Col md={8} className="ps-md-4 mt-3 mt-md-0">
                        <Alert
                          variant="info"
                          className="mb-0 border-0 bg-opacity-10"
                        >
                          <FaLightbulb className="me-2 text-info" />
                          <strong>AI Insight:</strong> {scoreData.feedback}
                        </Alert>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Skills Breakdown */}
                <Row className="g-3">
                  <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Header className="bg-success bg-opacity-10 text-success fw-bold border-0">
                        <FaCheckCircle className="me-2" /> Matched Skills
                      </Card.Header>

                      <Card.Body>
                        {scoreData.matched.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {scoreData.matched.map((s, i) => (
                              <Badge key={i} bg="success" className="fw-normal">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">
                            No exact matches found.
                          </span>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Header className="bg-danger bg-opacity-10 text-danger fw-bold border-0">
                        <FaExclamationTriangle className="me-2" /> Missing Keywords
                      </Card.Header>

                      <Card.Body>
                        {scoreData.missing.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {scoreData.missing.map((s, i) => (
                              <Badge
                                key={i}
                                bg="light"
                                text="dark"
                                className="border fw-normal"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-success small">
                            Perfect! No key skills missing.
                          </span>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* AI Chat Assistant */}
                <Card
                  className="border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column"
                  style={{ minHeight: "400px" }}
                >
                  <Card.Header className="bg-white border-bottom pt-3 pb-2">
                    <h6 className="fw-bold mb-0">
                      <FaRobot className="text-primary me-2" /> Job Lab Assistant
                    </h6>
                  </Card.Header>

                  {/* Chat messages */}
                  <Card.Body
                    className="bg-light d-flex flex-column overflow-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`d-flex mb-3 ${
                          m.sender === "user" ? "justify-content-end" : ""
                        }`}
                      >
                        <div
                          className={`p-3 rounded-3 shadow-sm ${
                            m.sender === "user"
                              ? "bg-primary text-white"
                              : "bg-white text-dark"
                          }`}
                          style={{ maxWidth: "80%", fontSize: "0.95rem" }}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-muted small ms-2">
                        <Spinner size="sm" className="me-1" /> typing...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </Card.Body>

                  {/* Chat Input */}
                  <div className="p-3 border-top bg-white rounded-bottom-4">
                    <Form onSubmit={handleSendChat} className="d-flex gap-2">
                      <Form.Control
                        placeholder="Ask specifically about this job..."
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        className="rounded-pill bg-light border-0 px-4"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px", padding: 0 }}
                      >
                        <FaPaperPlane size={14} />
                      </Button>
                    </Form>
                  </div>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* --- Loading Overlay --- */}
      {analyzing && (
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
          <h4 className="mt-4 text-light fw-bold">
            Analyzing Resume Match...
          </h4>
        </div>
      )}
    </div>
  );
}
