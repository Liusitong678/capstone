import { Card, Badge, Button } from "react-bootstrap";

const SOFT_BG = ["#FFE7D3", "#DDF7EC", "#E8F0FF", "#F7E8FF", "#FFF4E8"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function Chip({ children }) {
  return <span className="rb-chip">{children}</span>;
}

export default function JobCard({ job, onDetails, saved = false, onToggleSave }) {
  const {
    title = "Untitled role",
    company = "Unknown",
    location,
    salary,
    date,
    skills = [],
    level,
    schedule,
    applyUrl,
    url,
    source,
  } = job;

  const rawHref = applyUrl || url || "";
  const safeHref = rawHref ? (/^https?:\/\//i.test(rawHref) ? rawHref : `https://${rawHref}`) : "";

  // different color
  const key = job._uid || job.id || job.title || "x";
  const bg = SOFT_BG[hashString(key) % SOFT_BG.length];

  return (
    <Card className="rb-card">
      {/* Top bar */}
      <div className="rb-card-head">
        {date ? <Badge bg="light" text="dark" className="rb-date">{date}</Badge> : <span />}
        <div className="d-flex gap-2 align-items-center">
          {source && <Badge bg="light" text="dark">{source}</Badge>}

          {/* Favorite button */}
          <Button
            size="sm"
            variant="light"
            className={`rb-icon-btn rb-save-btn ${saved ? "is-saved" : ""}`}
            title={saved ? "Unsave" : "Save"}
            onClick={(e) => { e.stopPropagation(); onToggleSave?.(job); }}
          >
            {saved ? "★" : "☆"}
          </Button>
        </div>
      </div>

      {/* 内层颜色块（随机柔色） */}
      <div className="rb-card-inner" style={{ background: bg }}>
        <div className="rb-company">{company}</div>
        <h3 className="rb-title">{title}</h3>

        <div className="rb-card-body">
          {(schedule || level || skills.length > 0) && (
            <div className="rb-chips">
              {schedule && <Chip>{schedule}</Chip>}
              {level && <Chip>{level}</Chip>}
              {skills.slice(0, 6).map((s, i) => <Chip key={i}>{s}</Chip>)}
            </div>
          )}

          {(salary || location) && (
            <div>
              {salary && <div className="rb-salary">{salary}</div>}
              {location && <div className="rb-location">{location}</div>}
            </div>
          )}
        </div>
      </div>

      {/* bottom area */}
      <div className="rb-card-footer">
        {safeHref ? (
          <Button
            as="a"
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
          >
            Apply
          </Button>
        ) : <span />}
        <Button variant="light" size="sm" onClick={() => onDetails(job)}>Details</Button>
      </div>
    </Card>
  );
}
