import { useEffect, useState, useMemo } from "react";
import { Container, Card, Form, Button, Nav, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/useAuth";
import {
  updateUserProfile,
  fetchSavedJobs,
  fetchJobs,
  saveJob,
  unsaveJob,
} from "../services/api";
import api from "../services/api";
import ResumeViewer from "../components/ResumeViewer";
import JobCard from "../components/Jobcard";
import "../styles/profile-modern.css";

export default function Profile() {
  const navigate = useNavigate();
  const { firebaseUser, loading: authLoading, profile } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [allJobs, setAllJobs] = useState([]);
  const [savedSet, setSavedSet] = useState(new Set());

  const [editFields, setEditFields] = useState({ firstName: "", lastName: "" });

  const savedCount = savedSet.size;
  const savedJobs = useMemo(
    () =>
      allJobs.filter((j) => {
        const id = j._id || j.id || j._uid;
        return savedSet.has(id);
      }),
    [allJobs, savedSet]
  );

  /* ------------ LOAD AFTER AUTH IS READY ------------ */
  useEffect(() => {
    if (authLoading) return;      // waiting for Firebase
    if (!profile) return;        

    (async () => {
      try {
        setResumeUrl(profile.resumeUrl || "");

        setEditFields({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
        });

        // get all of job lists
        const [jobsList, savedIds] = await Promise.all([
          fetchJobs(),
          fetchSavedJobs(),       // return Set([...])
        ]);

        const normalized = jobsList.map((j, i) => ({
          ...j,
          _uid: j._uid || j._id || j.id || String(i),
        }));

        setAllJobs(normalized);
        setSavedSet(savedIds);
      } catch (e) {
        console.error("Profile init failed:", e);
      } finally {
        setPageLoading(false);
      }
    })();
  }, [authLoading, profile]);

  /* ------------ Upload Resume ------------ */
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.resumeUrl;
      setResumeUrl(url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ------------ Update Profile ------------ */
  const saveProfile = async () => {
    try {
      const updated = await updateUserProfile(editFields);
      console.log("Updated:", updated);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ------------ Toggle Save / Unsave ------------ */
  const handleToggleSave = async (job) => {
    const id = job._id || job.id || job._uid;
    if (!id) return;

    const prev = new Set(savedSet);
    const next = new Set(savedSet);
    const already = next.has(id);

    already ? next.delete(id) : next.add(id);
    setSavedSet(next);

    try {
      if (already) {
        await unsaveJob(id);
      } else {
        await saveJob(id);
      }
    } catch (e) {
      console.error(e);
      setSavedSet(prev);
      alert(e.message || "Failed to update saved job");
    }
  };

  /* ------------ Loading Screen ------------ */
  if (authLoading || pageLoading) {
    return (
      <div className="profile-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="profile-loading">
        <p>Please login to view your profile.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  /* ------------ MAIN UI ------------ */
  return (
    <div className="profile-page-wrapper">
      <Container className="profile-page-tabs">
        {/* LEFT CARD */}
        <Card className="side-profile-card">
          <div className="side-avatar">
            {(profile.firstName || "U")[0].toUpperCase()}
          </div>

          <h4 className="side-name">
            {profile.firstName} {profile.lastName}
          </h4>
          <p className="side-email">{profile.email}</p>

          <div className={`role-badge ${profile.role}`}>
            {profile.role === "admin" && "🛡️ Admin"}
            {profile.role === "premium" && "⭐ Premium"}
            {profile.role === "free" && "🆓 Free User"}
          </div>

          <div className="info-list">
            <div className="info-item">
              <span>Member Since</span>
              <strong>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "-"}
              </strong>
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
            <Nav.Item>
              <Nav.Link eventKey="account">Account Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="resume">Resume</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="saved">Saved Jobs</Nav.Link>
            </Nav.Item>
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
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      value={editFields.lastName}
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          lastName: e.target.value,
                        })
                      }
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
                {resumeUrl ? (
                  <ResumeViewer url={resumeUrl} />
                ) : (
                  <p>No resume uploaded.</p>
                )}

                <Form.Group className="mt-3">
                  <Form.Label>Upload New Resume</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                  {uploading && <Spinner size="sm" className="mt-2" />}
                </Form.Group>
              </div>
            )}

            {/* SAVED JOBS TAB – use JobCard component */}
            {activeTab === "saved" && (
              <div className="tab-content-box">
                {savedJobs.length === 0 ? (
                  <p>No saved jobs yet.</p>
                ) : (
                  <Row
                    xs={1}
                    sm={2}
                    lg={2}
                    xl={3}
                    xxl={3}
                    className="rb-grid g-4"
                  >
                    {savedJobs.map((j) => {
                      const id = j._id || j.id || j._uid;
                      return (
                        <Col key={id}>
                          <JobCard
                            job={j}
                            saved={savedSet.has(id)}
                            onToggleSave={handleToggleSave}
                            // Profile 里先不做详情弹窗，传一个空函数避免报错
                            onDetails={() => {}}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
