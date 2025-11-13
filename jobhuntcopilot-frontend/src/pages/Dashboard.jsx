import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Modal, Badge, Stack } from "react-bootstrap";
import { fetchJobs, fetchSavedJobs, saveJob, unsaveJob } from "../services/api";
import JobCard from "../components/Jobcard";
import FiltersSidebar from "../components/FiltersSidebar";
import Pager from "../components/Pager";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ★ 收藏：本地保存 jobId 集合
  const [savedIds, setSavedIds] = useState(new Set());

  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchJobs();
        const normalized = list.map((j, i) => ({
          ...j,
          _uid: j._uid || j._id || j.id || String(i),
        }));
        setJobs(normalized);

        // ★ 取后端已收藏
        const savedSet = await fetchSavedJobs(); // -> Set([...ids])
        setSavedIds(savedSet);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search
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
        (Array.isArray(j.skills) && j.skills.some((s) => hit(s)))
    );
  }, [jobs, search]);

  useEffect(() => { setPage(1); }, [search]);

  // Paging
  const totalPages = Math.max(1, Math.ceil(visibleJobs.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * PER_PAGE;
  const pageItems = visibleJobs.slice(start, start + PER_PAGE);
  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // ★ 判断当前 job 是否已收藏
  const isSaved = (job) => {
    const id = job._id || job.id || job._uid;
    return id ? savedIds.has(id) : false;
  };

  // ★ 点击星星：乐观更新 + 调接口
  const handleToggleSave = async (job) => {
    const id = job._id || job.id || job._uid;
    if (!id) return;

    const prev = new Set(savedIds);
    const next = new Set(savedIds);
    const already = next.has(id);
    already ? next.delete(id) : next.add(id);
    setSavedIds(next); // 乐观更新

    try {
      if (already) await unsaveJob(id);
      else await saveJob(id);
    } catch (e) {
      // 失败回滚
      setSavedIds(prev);
      alert((already ? "Unsave failed: " : "Save failed: ") + (e.message || "Unknown error"));
    }
  };

  return (
    <div className="rb-root">
      {/* Toolbar */}
      <div className="rb-toolbar">
        <Container fluid className="d-flex align-items-center gap-3">
          <InputGroup style={{ maxWidth: 460 }}>
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control
              placeholder="Search title, company, skill, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button variant="outline-light" onClick={() => setSearch("")}>
                Clear
              </Button>
            )}
          </InputGroup>
        </Container>
      </div>

      {/* Content */}
      <Container fluid className="rb-content">
        <Row className="g-4">
          <Col xxl={2} lg={3}>
            <FiltersSidebar state={filters} setState={setFilters} />
          </Col>

          <Col xxl={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="rb-section-title">Recommended jobs</div>
              <div className="text-muted small">Sort by: <strong>Last updated</strong></div>
            </div>

            {loading && <div className="rb-blank">Loading…</div>}
            {err && <div className="rb-blank error">{err}</div>}
            {!loading && !err && !visibleJobs.length && <div className="rb-blank">No jobs</div>}

            {!loading && !err && visibleJobs.length > 0 && (
              <Pager
                page={clampedPage}
                totalPages={totalPages}
                totalItems={visibleJobs.length}
                start={start}
                end={start + pageItems.length}
                onPrev={onPrev}
                onNext={onNext}
              />
            )}

            <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-4">
              {pageItems.map((j) => (
                <Col key={j._uid}>
                  <JobCard
                    job={j}
                    saved={isSaved(j)}              // ★ 传入是否已收藏
                    onToggleSave={handleToggleSave} // ★ 传入切换函数
                    onDetails={setSelected}
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
                onPrev={onPrev}
                onNext={onNext}
              />
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal */}
      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selected?.title}{" "}
            {selected?.company && <Badge bg="secondary" className="ms-2">{selected.company}</Badge>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
                {selected.location && <Badge bg="light" text="dark">{selected.location}</Badge>}
                {selected.level && <Badge bg="light" text="dark">{selected.level}</Badge>}
                {Array.isArray(selected.skills) && selected.skills.map((s, i) =>
                  <Badge key={i} bg="light" text="dark">{s}</Badge>
                )}
              </Stack>
              {selected.description && (<p style={{ whiteSpace: "pre-wrap" }}>{selected.description}</p>)}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected?.applyUrl && (
            <Button as="a" href={selected.applyUrl} target="_blank" rel="noreferrer" variant="primary">
              Apply
            </Button>
          )}
          <Button variant="outline-secondary" onClick={() => setSelected(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
