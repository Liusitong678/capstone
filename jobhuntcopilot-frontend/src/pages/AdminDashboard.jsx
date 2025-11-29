import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/useAuth";
import {
  fetchJobs,
  deleteJob as apiDeleteJob,
  createJob,
  updateJob,
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

  //  Add / Edit 
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null = Add 模式
  const [savingJob, setSavingJob] = useState(false);

  // Delete 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const role = profile?.role || roleFromAuth || "free";

  // 封装一个加载 Job 列表的函数，Add / Edit / Delete 后都可以重用
  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      setErr("");

      const list = await fetchJobs();
      console.log("AdminDashboard jobs:", list);

      // fetchJobs 
      setJobs(list);
    } catch (e) {
      console.error("Load jobs failed in AdminDashboard:", e);
      setErr(e.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  // initial load（ admin only)
  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) return;
    if (role !== "admin") return;

    loadJobs();
  }, [authLoading, firebaseUser, role]);

  // ========== Add / Edit  ==========

  // click  Add Job
  const handleAddClick = () => {
    setEditingJob(null); // null = 新建
    setShowFormModal(true);
  };

  // click Edit
  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowFormModal(true);
  };

  // JobFormModal submit
  const handleSaveJob = async (payload) => {
    try {
      setSavingJob(true);
      setErr("");

      if (editingJob) {
        const jobId =
          editingJob.raw?._id ||
          editingJob.raw?.id ||
          editingJob._id ||
          editingJob.id ||
          editingJob._uid;

        if (!jobId) throw new Error("Missing job id for update");

        await updateJob(jobId, payload);
      } else {
        // Add mode：POST /api/jobs
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

  // ========== Delete  ==========

  // click Delete，open Modal
  const handleAskDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  // undelete
  const handleCancelDelete = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  // confirm delete
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      setErr("");

      const jobId =
        jobToDelete.raw?._id ||
        jobToDelete.raw?.id ||
        jobToDelete._id ||
        jobToDelete.id ||
        jobToDelete._uid;

      if (!jobId) {
        throw new Error("Missing job id for delete");
      }

      await apiDeleteJob(jobId);

      // Update front-end list
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

  // ========== 权限 & Loading 拦截 ==========

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
                  <th>Source</th>
                  <th>Posted At</th>
                  <th>Skills</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  const id = job._uid || job._id || job.id;
                  const posted =
                    job.postedAt && !isNaN(new Date(job.postedAt))
                      ? new Date(job.postedAt).toLocaleDateString()
                      : "-";

                  return (
                    <tr key={id || index}>
                      <td>{index + 1}</td>
                      <td>{job.title || "-"}</td>
                      <td>{job.company || "Unknown"}</td>
                      <td>{job.location || "Unknown"}</td>
                      <td>{job.source || "-"}</td>
                      <td>{posted}</td>
                      <td>
                        {Array.isArray(job.skills) && job.skills.length > 0
                          ? job.skills.join(", ")
                          : "-"}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-pill-soft" 
                            onClick={() => handleEditClick(job)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="btn-pill-outline"
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

        {/* ====== Delete 确认弹窗 ====== */}
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
            <p className="mb-2">
              Are you sure you want to delete
              <strong> "{jobToDelete?.title || "this job"}"</strong>
              {jobToDelete?.company && (
                <>
                  {" "}
                  at <strong>{jobToDelete.company}</strong>
                </>
              )}
              ?
            </p>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ====== Add / Edit Job 表单弹窗 ====== */}
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
