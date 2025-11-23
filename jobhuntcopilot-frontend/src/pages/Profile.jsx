import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Nav,
  Spinner,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
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
  const { firebaseUser, loading: authLoading, profile, refreshProfile } =
    useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [allJobs, setAllJobs] = useState([]);
  const [savedSet, setSavedSet] = useState(new Set());

  const [editFields, setEditFields] = useState({
    firstName: "",
    lastName: "",
  });

  // Toast — show success or error
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showSuccess = (msg) =>
    setToast({ show: true, message: msg, variant: "success" });

  const showError = (msg) =>
    setToast({ show: true, message: msg, variant: "danger" });

  const savedCount = savedSet.size;

  const savedJobs = useMemo(
    () =>
      allJobs.filter((j) => {
        const id = j._id || j.id || j._uid;
        return savedSet.has(id);
      }),
    [allJobs, savedSet]
  );

  /* ------------ LOAD PROFILE DATA ------------ */
  useEffect(() => {
    if (authLoading) return;
    if (!profile) return;

    (async () => {
      try {
        setResumeUrl(profile.resumeUrl || "");

        setEditFields({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
        });

        const [jobsList, savedIds] = await Promise.all([
          fetchJobs(),
          fetchSavedJobs(),
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

  /* ------------ UPLOAD RESUME ------------ */
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      showError("Only PDF files are supported.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.resumeUrl || res.data?.resumeUrl;
      if (url) {
        setResumeUrl(url);
        await refreshProfile();
        showSuccess("Resume uploaded successfully!");
      } else {
        showError("Upload succeeded but no resume URL returned.");
      }
    } catch (err) {
      console.error(err);
      showError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* ------------ UPDATE PROFILE ------------ */
  const saveProfile = async () => {
    try {
      await updateUserProfile(editFields);

      // Update Firebase display name
      await updateFirebaseProfile(firebaseUser, {
        displayName: `${editFields.firstName} ${editFields.lastName}`,
      });

      await firebaseUser.getIdToken(true);
      await refreshProfile();

      showSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      showError("Update failed.");
    }
  };

  /* ------------ SAVE / UNSAVE ------------ */
  const handleToggleSave = async (job) => {
    const id = job._id || job.id || job._uid;
    if (!id) return;

    const prev = new Set(savedSet);
    const next = new Set(savedSet);

    const already = next.has(id);
    already ? next.delete(id) : next.add(id);
    setSavedSet(next);

    try {
      already ? await unsaveJob(id) : await saveJob(id);
    } catch (e) {
      console.error(e);
      setSavedSet(prev);
      showError("Failed to update saved job.");
    }
  };

  /* ------------ LOADING & AUTH ------------ */
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
      {/* TOAST — centered */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toast.variant}
          show={toast.show}
          autohide
          delay={2800}
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>


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
                    accept=".pdf"
                    onChange={handleResumeUpload}
                  />
                  {uploading && <Spinner size="sm" className="mt-2" />}
                </Form.Group>
              </div>
            )}

            {/* SAVED JOBS TAB */}
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
                            onDetails={() => { }}
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
