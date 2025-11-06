import { Card, Badge, Button } from "react-bootstrap";

const SOFT_BG = ["#FFE7D3", "#DDF7EC", "#E8F0FF", "#F7E8FF", "#FFF4E8"];

function hashCode(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function Chip({ children }) {
  return <span className="rb-chip">{children}</span>;
}

export default function JobCard({ job, onDetails, onCheckScore, aiScore }) {
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
  const safeHref = rawHref
    ? /^https?:\/\//i.test(rawHref)
      ? rawHref
      : `https://${rawHref}`
    : "";

  const colorKey = `${company}::${title}`;
  const colorIdx = hashCode(colorKey) % SOFT_BG.length;
  const innerBg = SOFT_BG[colorIdx];

  return (
    <Card className="rb-card">
      <div className="rb-card-inner" style={{ background: innerBg }}>
        <div className="rb-card-head">
          {date ? (
            <Badge bg="light" text="dark" className="rb-date">{date}</Badge>
          ) : <span />}
          <div className="d-flex gap-2 align-items-center">
            {source && <Badge bg="light" text="dark" title="Source">{source}</Badge>}
            <Button size="sm" variant="light" className="rb-icon-btn" title="Save" aria-label="Save job">
              ♡
            </Button>
          </div>
        </div>

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

      <div className="rb-card-footer d-flex gap-2">
        {/* Check AI Score button styled like Apply */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onCheckScore(job._uid)}
        >
          Check AI Score
        </Button>

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
        ) : <span /> }
        <Button variant="light" size="sm" onClick={() => onDetails(job)}>Details</Button>
      </div>

      {/* Show AI Score dynamically */}
      {aiScore && (
        <div className="mt-2 p-2 border rounded bg-light">
          <p className="mb-1"><strong>AI Score:</strong> {(aiScore.score * 100).toFixed(2)}%</p>
          <p className="mb-0"><strong>Matched Skills:</strong> {aiScore.matchedSkills?.join(', ') || 'No skills matched'}</p>
        </div>
      )}
    </Card>
  );
}
