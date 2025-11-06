import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Modal, Badge, Stack } from "react-bootstrap";
import { fetchJobs, callScore } from "../services/api";
import JobCard from "../components/JobCard";
import FiltersSidebar from "../components/FiltersSidebar";
import "../styles/dashboard.css";

export default function DashboardPro() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(100);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [aiScores, setAiScores] = useState({}); // Store AI score per job

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchJobs(); // 从 /api/jobs 拿数据
        const normalized = list.map((j, i) => ({
          ...j,
          _uid: j._uid || j._id || j.id || String(i),
        }));
        setJobs(normalized);
      } catch (e) {
        setErr(e.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Simple filter for title/company and pseudo salary
  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const toNum = (s) => {
      if (!s) return NaN;
      const m = String(s).match(/(\d+(\.\d+)?)/g);
      return m ? Number(m[0]) : NaN;
    };
    return jobs.filter((j) => {
      const okQ =
        !q || [j.title, j.company].some((x) => String(x || "").toLowerCase().includes(q));
      const n = toNum(j.salary);
      const okSalary = isNaN(n) ? true : n >= salaryMin && n <= salaryMax;
      return okQ && okSalary;
    });
  }, [jobs, search, salaryMin, salaryMax]);

  // Handle AI Score
  const handleCheckScore = async (jobId) => {
    try {
      const job = jobs.find((j) => j._uid === jobId);
      if (!job) return;

      const payload = { jobTitle: job.title, description: job.description };
      const result = await callScore(payload);
      setAiScores((prev) => ({ ...prev, [jobId]: result }));
    } catch (err) {
      console.error("Error fetching AI score:", err);
      alert("Failed to fetch AI score");
    }
  };

  return (
    <div className="rb-root">
      {/* Toolbar */}
      <div className="rb-toolbar">
        <Container fluid className="d-flex align-items-center gap-3">
          <Button size="sm" variant="outline-light">Designer ▾</Button>
          <Button size="sm" variant="outline-light">Work location ▾</Button>
          <Button size="sm" variant="outline-light">Experience ▾</Button>
          <Button size="sm" variant="outline-light">Per month ▾</Button>
        </Container>
      </div>

      {/* Main Content */}
      <Container fluid className="rb-content">
        <Row className="g-4">
          {/* Left Filter */}
          <Col xxl={2} lg={3}>
            <FiltersSidebar state={filters} setState={setFilters} />
          </Col>

          {/* Right Card Grid */}
          <Col xxl={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="rb-section-title">Recommended jobs</div>
              <div className="text-muted small">
                Sort by: <strong>Last updated</strong>
              </div>
            </div>

            {loading && <div className="rb-blank">Loading…</div>}
            {err && <div className="rb-blank error">{err}</div>}
            {!loading && !err && !visibleJobs.length && <div className="rb-blank">No jobs</div>}

            <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-4">
              {visibleJobs.map((job) => (
                <Col key={job._uid}>
                  <JobCard
                    job={job}
                    onDetails={setSelected}
                    onCheckScore={handleCheckScore}
                    aiScore={aiScores[job._uid]}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Job Details Modal */}
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
                {Array.isArray(selected.skills) &&
                  selected.skills.map((s, i) => <Badge key={i} bg="light" text="dark">{s}</Badge>)}
              </Stack>
              {selected.description && (
                <p style={{ whiteSpace: "pre-wrap" }}>{selected.description}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected?.applyUrl && (
            <Button as="a" href={selected.applyUrl} target="_blank" rel="noreferrer" variant="primary">
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
