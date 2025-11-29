import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Badge,
  Stack,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero-dashboard.png";
import { fetchJobs, fetchSavedJobs, saveJob, unsaveJob } from "../services/api";
import JobCard from "../components/Jobcard";
// import FiltersSidebar from "../components/FiltersSidebar";
import Pager from "../components/Pager";
import "../styles/dashboard.css";
import { useAuth } from "../firebase/useAuth";
import GuestLanding from "./Home";   

export default function Dashboard() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  // const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // ==== 加载数据 ====
  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) return;

    (async () => {
      try {
        // const list = await fetchJobs();
        // setJobs(
        //   list.map((j, i) => ({
        //     ...j,
        //     _uid: j._uid || j._id || j.id || String(i),
        //   }))
        // );
        const list = await fetchJobs();

        // ⭐ 按岗位发布时间排序：最新在最前
        list.sort((a, b) => {
          // 处理不存在 date 的情况
          const da = new Date(a.date || a.updatedAt || a.createdAt || 0);
          const db = new Date(b.date || b.updatedAt || b.createdAt || 0);
          return db - da; // 降序：最新在前
        });

        setJobs(
          list.map((j, i) => ({
            ...j,
            _uid: j._uid || j._id || j.id || String(i),
          }))
        );

        setSavedIds(await fetchSavedJobs());
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, firebaseUser]);

  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    const hit = (v) => String(v || "").toLowerCase().includes(q);

    return jobs.filter(
      (j) =>
        hit(j.title) ||
        hit(j.company) ||
        hit(j.location) ||
        hit(j.source) ||
        (Array.isArray(j.skills) && j.skills.some(hit))
    );
  }, [jobs, search]);

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.max(1, Math.ceil(visibleJobs.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * PER_PAGE;
  const pageItems = visibleJobs.slice(start, start + PER_PAGE);

  const isSaved = (job) => {
    const id = job._id || job.id || job._uid;
    return savedIds.has(id);
  };

  const handleToggleSave = async (job) => {
    const id = job._id || job.id || job._uid;
    if (!id) return;

    const prev = new Set(savedIds);
    const next = new Set(savedIds);
    const already = next.has(id);

    already ? next.delete(id) : next.add(id);
    setSavedIds(next);

    try {
      if (already) await unsaveJob(id);
      else await saveJob(id);
    } catch (e) {
      setSavedIds(prev);
      alert(e.message || "Action failed");
    }
  };

  // ===== 未登录 / 恢复 Session =====
  if (authLoading) {
    return (
      <div className="rb-root">
        <Container
          className="py-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="text-muted text-center">
            <Spinner animation="border" size="sm" className="me-2" />
            Restoring your session…
          </div>
        </Container>
      </div>
    );
  }

  if (!firebaseUser) {
    return <GuestLanding />;
  }

  // ===== 已登录主页面 =====
  return (
    <div className="rb-root">
      {/* Hero  */}
      <div className="rb-toolbar">
        <Container className="rb-hero">
          <div className="rb-hero-left">
            <h1 className="rb-hero-title">Find Your Dream Job</h1>
            <p className="rb-hero-subtitle">
              Discover tailored job matches, save your favorite roles, and let
              JobHunt Copilot help you stay organized.
            </p>

            {/* search bar */}
            <div className="rb-search-shell">
              <div className="rb-search-block rb-search-keyword">
                <span className="rb-search-icon">🔍</span>
                <div className="rb-search-texts">
                  <span className="rb-search-label">Job title or keyword</span>
                  <Form.Control
                    className="rb-search-input"
                    placeholder="e.g. Front-End Developer"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="button"
                className="rb-search-btn"
                onClick={() => {}}
              >
                Search
              </Button>
            </div>
          </div>

          {/* right image */}
          <div className="rb-hero-right floating-illustration">
            <img
              src={heroImg}
              alt="Job hunter at laptop"
              className="rb-hero-illustration"
            />
          </div>
        </Container>
      </div>

      {/* job list */}
      <Container fluid className="rb-content">
        <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-5 px-3">
          {/* <Col xxl={2} lg={3}>
            <FiltersSidebar state={filters} setState={setFilters} />
          </Col> */}

          <Col xxl={12} lg={13}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="rb-section-title">Recommended jobs</div>
              <div className="text-muted small">
                Sort by: <strong>Last updated</strong>
              </div>
            </div>

            {loading && <div className="rb-blank">Loading…</div>}
            {err && <div className="rb-blank error">{err}</div>}
            {!loading && !err && visibleJobs.length === 0 && (
              <div className="rb-blank">No jobs</div>
            )}

            {!loading && !err && visibleJobs.length > 0 && (
              <Pager
                page={clampedPage}
                totalPages={totalPages}
                totalItems={visibleJobs.length}
                start={start}
                end={start + pageItems.length}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            )}

            <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-4">
              {pageItems.map((j) => (
                <Col key={j._uid}>
                  <JobCard
                    job={j}
                    saved={isSaved(j)}
                    onToggleSave={handleToggleSave}
                    onDetails={setSelected}
                    onApply={(job) => navigate(`/job/${job._uid}`)}
                  />
                </Col>
              ))}
            </Row>

            {!loading && !err && visibleJobs.length > 0 && (
              <Pager
                page={clampedPage}
                totalPages={totalPages}
                totalItems={visibleJobs.length}
                start={start}
                end={start + pageItems.length}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            )}
          </Col>
        </Row>
      </Container>

      {/* details pop */}
      <Modal
        show={!!selected}
        onHide={() => setSelected(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selected?.title}
            {selected?.company && (
              <Badge bg="secondary" className="ms-2">
                {selected.company}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
                {selected.location && (
                  <Badge bg="light" text="dark">
                    {selected.location}
                  </Badge>
                )}
                {selected.level && (
                  <Badge bg="light" text="dark">
                    {selected.level}
                  </Badge>
                )}
                {Array.isArray(selected.skills) &&
                  selected.skills.map((s, i) => (
                    <Badge key={i} bg="light" text="dark">
                      {s}
                    </Badge>
                  ))}
              </Stack>
              {selected.description && (
                <p style={{ whiteSpace: "pre-wrap" }}>{selected.description}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected?.applyUrl && (
            <Button
              variant="primary"
              onClick={() => {
                setSelected(null);
                navigate(`/job/${selected._uid}`);
              }}
            >
              Apply
            </Button>
          )}
          <Button variant="outline-secondary" onClick={() => setSelected(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
