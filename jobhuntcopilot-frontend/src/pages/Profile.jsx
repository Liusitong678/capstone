// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Nav, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/useAuth";
import { updateUserProfile, fetchSavedJobs } from "../services/api";
import api from "../services/api";
import ResumeViewer from "../components/ResumeViewer";
import "../styles/profile-modern.css";

export default function Profile() {
  const navigate = useNavigate();
  const { firebaseUser, loading: authLoading, profile } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  const [editFields, setEditFields] = useState({ firstName: "", lastName: "" });

  /* ------------ LOAD AFTER AUTH IS READY ------------ */
  useEffect(() => {
    if (authLoading) return;           // Wait for Firebase
    if (!profile) return;              // Profile still loading inside provider

    (async () => {
      setResumeUrl(profile.resumeUrl || "");

      setEditFields({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });

      const saved = await fetchSavedJobs();
      const arr = Array.from(saved);
      setSavedJobs(arr);
      setSavedCount(arr.length);

      setPageLoading(false);
    })();
  }, [authLoading, profile]);

  /* ------------ Upload Resume ------------ */
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const url = res.resumeUrl;
    setResumeUrl(url);
    setUploading(false);
  };

  /* ------------ Update Profile ------------ */
  const saveProfile = async () => {
    const updated = await updateUserProfile(editFields);
    console.log("Updated:", updated);
  };

  /* ------------ Loading Screen ------------ */
  if (authLoading || pageLoading) {
    return (
      <div className="profile-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  /* ------------ MAIN UI ------------ */
  return (
    <div className="profile-page-wrapper">
      <Container className="profile-page-tabs">

        {/* LEFT CARD */}
        <Card className="side-profile-card">
          <div className="side-avatar">{profile.firstName[0]}</div>

          <h4 className="side-name">{profile.firstName} {profile.lastName}</h4>
          <p className="side-email">{profile.email}</p>

          <div className={`role-badge ${profile.role}`}>
            {profile.role === "admin" && "🛡️ Admin"}
            {profile.role === "premium" && "⭐ Premium"}
            {profile.role === "free" && "🆓 Free User"}
          </div>

          <div className="info-list">
            <div className="info-item">
              <span>Member Since</span>
              <strong>{new Date(profile.createdAt).toLocaleDateString()}</strong>
            </div>

            <div className="info-item" onClick={() => setActiveTab("saved")}>
              <span>Saved Jobs</span>
              <strong style={{ cursor: "pointer" }}>{savedCount}</strong>
            </div>
          </div>

          {profile.role === "free" && (
            <Button className="upgrade-btn">Upgrade to Premium ⭐</Button>
          )}
        </Card>

        {/* RIGHT CARD */}
        <Card className="main-content-card">

          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item><Nav.Link eventKey="account">Account Details</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="resume">Resume</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="saved">Saved Jobs</Nav.Link></Nav.Item>
          </Nav>

          <div className="content-body">

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="tab-content-box">
                <div className="form-grid">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      value={editFields.firstName}
                      onChange={(e) => setEditFields({ ...editFields, firstName: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      value={editFields.lastName}
                      onChange={(e) => setEditFields({ ...editFields, lastName: e.target.value })}
                    />
                  </Form.Group>
                </div>

                <Button className="update-btn" onClick={saveProfile}>
                  Update
                </Button>
              </div>
            )}

            {/* RESUME TAB */}
            {activeTab === "resume" && (
              <div className="tab-content-box">
                {resumeUrl ? <ResumeViewer url={resumeUrl} /> : <p>No resume uploaded.</p>}

                <Form.Group className="mt-3">
                  <Form.Label>Upload New Resume</Form.Label>
                  <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                  {uploading && <Spinner size="sm" className="mt-2" />}
                </Form.Group>
              </div>
            )}

            {/* SAVED JOBS */}
            {activeTab === "saved" && (
              <div className="tab-content-box">
                {savedJobs.length === 0 ? (
                  <p>No saved jobs yet.</p>
                ) : (
                  savedJobs.map((jobId) => (
                    <Card key={jobId} className="p-3 mb-3 shadow-sm">
                      <h5>Job ID: {jobId}</h5>
                      <Button size="sm" onClick={() => navigate(`/job/${jobId}`)}>
                        View Job
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            )}

          </div>
        </Card>
      </Container>
    </div>
  );
}
