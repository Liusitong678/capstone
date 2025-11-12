import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Modal, Badge, Stack } from "react-bootstrap";
import { fetchJobs } from "../services/api";
import JobCard from "../components/Jobcard";
import FiltersSidebar from "../components/FiltersSidebar";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";


export default function DashboardPro() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(100);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      try {
        const list = await fetchJobs();                 // 从 /api/jobs 拿数据
        // Lightweight specification: Ensure that each item has _uid
        const normalized = list.map((j, i) => ({ ...j, _uid: j._uid || j._id || j.id || String(i) }));
        setJobs(normalized);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 简单过滤（按标题/公司 & 伪 salary 范围：从字符串里抽数字）
  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const toNum = (s) => {
      if (!s) return NaN;
      const m = String(s).match(/(\d+(\.\d+)?)/g);
      return m ? Number(m[0]) : NaN;
    };
    return jobs.filter(j => {
      const okQ = !q || [j.title, j.company].some(x => String(x || "").toLowerCase().includes(q));
      const n = toNum(j.salary);
      const okSalary = isNaN(n) ? true : (n >= salaryMin && n <= salaryMax);
      return okQ && okSalary;
    });
  }, [jobs, search, salaryMin, salaryMax]);

  return (
    <div className="rb-root">

      {/* Secondary screening criteria */}
      <div className="rb-toolbar">
        <Container fluid className="d-flex align-items-center gap-3">
          <Button size="sm" variant="outline-light">Designer ▾</Button>
          <Button size="sm" variant="outline-light">Work location ▾</Button>
          <Button size="sm" variant="outline-light">Experience ▾</Button>
          <Button size="sm" variant="outline-light">Per month ▾</Button>

          {/* <div className="ms-auto d-flex align-items-center gap-2">
            <span className="text-white-50 small">Salary range</span>
            <Form.Range min={0} max={100} value={salaryMin} onChange={(e)=>setSalaryMin(Number(e.target.value))}/>
            <Form.Range min={0} max={100} value={salaryMax} onChange={(e)=>setSalaryMax(Number(e.target.value))}/>
          </div> */}
        </Container>
      </div>

      {/* content */}
      <Container fluid className="rb-content">
        <Row className="g-4">
          {/* Left side filter */}
          <Col xxl={2} lg={3}>
            <FiltersSidebar state={filters} setState={setFilters} />
          </Col>

          {/* Right card grid*/}
          <Col xxl={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="rb-section-title">Recommended jobs</div>
              <div className="text-muted small">Sort by: <strong>Last updated</strong></div>
            </div>

            {loading && <div className="rb-blank">Loading…</div>}
            {err && <div className="rb-blank error">{err}</div>}
            {!loading && !err && !visibleJobs.length && <div className="rb-blank">No jobs</div>}

            <Row xs={1} sm={2} lg={2} xl={3} xxl={3} className="rb-grid g-4">
              {visibleJobs.map(j => (
                <Col key={j._uid}>
                  <JobCard //change. nb
                    job={j}
                    onDetails={setSelected}
                    onApply={(job) => navigate(`/job/${job._uid}`)}  
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* details Modal（click Details） */}
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
                {Array.isArray(selected.skills) && selected.skills.map((s, i) => <Badge key={i} bg="light" text="dark">{s}</Badge>)}
              </Stack>
              {selected.description && (<p style={{ whiteSpace: "pre-wrap" }}>{selected.description}</p>)}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected?.applyUrl && (
            <Button   //change. nb
              variant="primary"
              onClick={() => {
                setSelected(null);
                navigate(`/job/${selected._uid}`);
              }}
            >
              Apply
            </Button>

          )}
          <Button variant="outline-secondary" onClick={() => setSelected(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}