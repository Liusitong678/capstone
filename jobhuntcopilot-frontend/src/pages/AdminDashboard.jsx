import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Modal, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/useAuth";
import {
  fetchAdminJobs,
  deleteJob as apiDeleteJob,
  createJob,
  updateJob,
  approveJob,
  rejectJob,
} from "../services/api";

import JobFormModal from "../components/JobFormModal";
import "../styles/admin-dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { firebaseUser, loading: authLoading, profile, role: roleFromAuth } =
    useAuth();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [err, setErr] = useState("");

  // Add / Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [savingJob, setSavingJob] = useState(false);

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const role = profile?.role || roleFromAuth || "free";

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      setErr("");

      const list = await fetchAdminJobs();
      setJobs(list);
    } catch (e) {
      console.error("Load jobs failed in AdminDashboard:", e);
      setErr(e.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) return;
    if (role !== "admin") return;

    loadJobs();
  }, [authLoading, firebaseUser, role]);

  // ==================== Approve / Reject ====================
  const getJobId = (job) =>
    job.raw?._id ||
    job.raw?.id ||
    job._id ||
    job.id ||
    job._uid;

  const handleApprove = async (job) => {
    try {
      const jobId = getJobId(job);
      if (!jobId) throw new Error("Missing job ID");

      await approveJob(jobId);
      await loadJobs();
    } catch (e) {
      console.error("Approve job failed:", e);
      setErr(e.message || "Failed to approve job");
    }
  };

  const handleReject = async (job) => {
    const reason = prompt("Reason for rejection?", "Low-quality job posting");
    try {
      const jobId = getJobId(job);
      if (!jobId) throw new Error("Missing job ID");

      await rejectJob(jobId, reason || undefined);
      await loadJobs();
    } catch (e) {
      console.error("Reject job failed:", e);
      setErr(e.message || "Failed to reject job");
    }
  };

  // ==================== Add / Edit ====================

  const handleAddClick = () => {
    setEditingJob(null);
    setShowFormModal(true);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowFormModal(true);
  };

  const handleSaveJob = async (payload) => {
    try {
      setSavingJob(true);
      setErr("");

      if (editingJob) {
        const jobId = getJobId(editingJob);
        if (!jobId) throw new Error("Missing job id for update");
        await updateJob(jobId, payload);
      } else {
        await createJob(payload);
      }

      await loadJobs();
      setShowFormModal(false);
      setEditingJob(null);
    } catch (e) {
      console.error("Save job failed:", e);
      setErr(e.message || "Failed to save job");
    } finally {
      setSavingJob(false);
    }
  };

  // ==================== Delete ====================

  const handleAskDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      setErr("");

      const jobId = getJobId(jobToDelete);
      if (!jobId) throw new Error("Missing job ID");

      await apiDeleteJob(jobId);

      setJobs((prev) => prev.filter((j) => j._uid !== jobToDelete._uid));

      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (e) {
      console.error("Delete job failed:", e);
      setErr(e.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  // ==================== PERMISSION GUARDS ====================

  if (authLoading) {
    return (
      <div className="admin-page-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="admin-page-loading">
        <p>You need to log in to view this page.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="admin-page-loading">
        <Alert variant="danger">
          You do not have permission to view this page. (Admin only)
        </Alert>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Admin · Job Management</h2>
          <Button variant="primary" onClick={handleAddClick}>
            + Add Job
          </Button>
        </div>

        {err && (
          <Alert variant="danger" className="mb-3">
            {err}
          </Alert>
        )}

        {loadingJobs ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : jobs.length === 0 ? (
          <Alert variant="info">No jobs found.</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover size="sm" className="align-middle admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>    {/* ← NEW COLUMN */}
                  <th>Source</th>
                  <th>Posted At</th>
                  <th>Skills</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job, index) => {
                  const id = getJobId(job);
                  const posted =
                    job.postedAt && !isNaN(new Date(job.postedAt))
                      ? new Date(job.postedAt).toLocaleDateString()
                      : "-";

                  const status = job.raw?.status || "approved"; // default for old jobs

                  return (
                    <tr key={id || index}>
                      <td>{index + 1}</td>
                      <td>{job.title || "-"}</td>
                      <td>{job.company || "Unknown"}</td>
                      <td>{job.location || "Unknown"}</td>

                      {/* ========== BADGE FOR STATUS ========== */}
                      <td>
                        {status === "pending" && (
                          <Badge bg="warning" text="dark">Pending</Badge>
                        )}
                        {status === "approved" && (
                          <Badge bg="success">Approved</Badge>
                        )}
                        {status === "rejected" && (
                          <Badge bg="danger">Rejected</Badge>
                        )}
                      </td>

                      <td>{job.source || "-"}</td>
                      <td>{posted}</td>
                      <td>
                        {Array.isArray(job.skills) && job.skills.length > 0
                          ? job.skills.join(", ")
                          : "-"}
                      </td>

                      {/* ========== ACTION BUTTONS ========== */}
                      <td>
                        <div className="d-flex gap-2">

                          {/* Approve / Reject only for pending jobs */}
                          {status === "pending" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApprove(job)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(job)}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEditClick(job)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleAskDelete(job)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </Table>
          </div>
        )}

        {/* Delete Modal */}
        <Modal
          show={showDeleteModal}
          onHide={handleCancelDelete}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete
            <strong> "{jobToDelete?.title}"</strong>?
            <br />
            <span className="text-muted">This action cannot be undone.</span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add / Edit Modal */}
        <JobFormModal
          show={showFormModal}
          mode={editingJob ? "edit" : "add"}
          initialJob={editingJob}
          saving={savingJob}
          onHide={() => {
            if (savingJob) return;
            setShowFormModal(false);
            setEditingJob(null);
          }}
          onSubmit={handleSaveJob}
        />
      </Container>
    </div>
  );
}
