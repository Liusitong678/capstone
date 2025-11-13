import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  fetchJobs,
  fetchSavedJobs,
  saveJob,
  unsaveJob,
} from "../services/api";
import JobCard from "../components/Jobcard";
import Pager from "../components/Pager";
import "../styles/dashboard.css";

export default function SavedJobs() {
  const navigate = useNavigate();

  const [allJobs, setAllJobs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---------- pagination ----------
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const [list, idSet] = await Promise.all([fetchJobs(), fetchSavedJobs()]);
        if (abort) return;

        const normalized = list.map((j, i) => ({
          ...j,
          _uid: j._uid || j._id || j.id || String(i),
        }));

        setAllJobs(normalized);
        setSavedIds(idSet);
      } catch (e) {
        if (!abort) setErr(e.message || "Failed to load saved jobs");
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  // All saved jobs
  const savedList = useMemo(
    () => allJobs.filter((j) => savedIds.has(j._uid)),
    [allJobs, savedIds]
  );

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(savedList.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * PER_PAGE;
  const pageItems = savedList.slice(start, start + PER_PAGE);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // toggle save/unsave
  const handleToggleSave = async (job) => {
    const id = job._id || job.id || job._uid;
    if (!id) return;

    const next = new Set(savedIds);
    const already = next.has(id);

    already ? next.delete(id) : next.add(id);
    setSavedIds(next);

    try {
      if (already) await unsaveJob(id);
      else await saveJob(id);
    } catch (e) {
      const rollback = new Set(savedIds);
      setSavedIds(rollback);
      alert(
        (already ? "Unsave failed: " : "Save failed: ") +
          (e.message || "Unknown error")
      );
    }
  };

  // ------------------- UI --------------------
  if (loading) {
    return (
      <div className="rb-root">
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-2 text-muted">Loading…</div>
        </Container>
      </div>
    );
  }

  if (err) {
    return (
      <div className="rb-root">
        <Container className="py-4">
          <Alert variant="danger">{err}</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="rb-root">
      {/* toolbar */}
      <div className="rb-toolbar d-flex align-items-center">
        <Container fluid className="d-flex align-items-center justify-content-between">
          
          {/* ← 返回按钮 */}
          <button
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="text-white fw-bold">Saved Jobs</div>
          <div className="text-white-50 small">{savedList.length} saved</div>
        </Container>
      </div>

      {/* content */}
      <Container fluid className="rb-content">
        {savedList.length === 0 ? (
          <div className="rb-blank">You have no saved jobs yet.</div>
        ) : (
          <>
            {/* top pagination */}
            <Pager
              page={clampedPage}
              totalPages={totalPages}
              totalItems={savedList.length}
              start={start}
              end={start + pageItems.length}
              onPrev={onPrev}
              onNext={onNext}
            />

            <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-4">
              {pageItems.map((j) => (
                <Col key={j._uid}>
                  <JobCard
                    job={j}
                    saved={savedIds.has(j._uid)}
                    onToggleSave={handleToggleSave}
                  />
                </Col>
              ))}
            </Row>

            {/* bottom pagination */}
            <Pager
              page={clampedPage}
              totalPages={totalPages}
              totalItems={savedList.length}
              start={start}
              end={start + pageItems.length}
              onPrev={onPrev}
              onNext={onNext}
            />
          </>
        )}
      </Container>
    </div>
  );
}
