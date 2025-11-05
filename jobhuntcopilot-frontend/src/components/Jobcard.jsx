import { Card, Badge, Button, Stack } from "react-bootstrap";

const softBg = ["#FFE7D3", "#DDF7EC", "#E8F0FF", "#F7E8FF", "#FFF4E8"];

function Chip({ children }) {
  return (
    <span className="rb-chip">{children}</span>
  );
}

export default function JobCard({ job, onDetails }) {
  const {
    title = "Untitled role",
    company = "Unknown",
    location,
    salary,            // such as “$150/hr” 或 “10-15K”
    date,              // such as “20 May, 2023”
    skills,            // array
    level, schedule,   // string
    applyUrl
  } = job;

  // Give each card a soft background color
  const bg = softBg[Math.abs((job._uid || "").charCodeAt?.(0) || 0) % softBg.length];

  return (
    <Card className="rb-card" style={{ background: bg }}>
      <Card.Body>
        {/* Date&Collection Space */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {date ? <Badge bg="light" text="dark" className="rb-date">{date}</Badge> : <span/>}
          <Button size="sm" variant="light" className="rb-icon-btn" title="Save">♡</Button>
        </div>

        <div className="rb-company">{company}</div>
        <Card.Title className="rb-title">{title}</Card.Title>

        {/* key information chip */}
        <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
          {schedule && <Chip>{schedule}</Chip>}
          {level && <Chip>{level}</Chip>}
          {Array.isArray(skills) && skills.slice(0,4).map((s,i)=><Chip key={i}>{s}</Chip>)}
          {location && <Chip>{location}</Chip>}
        </Stack>

        {/* Salary&Location */}
        {(salary || location) && (
          <div className="d-flex justify-content-between align-items-center rb-meta">
            <div>
              {salary && <div className="rb-salary">{salary}</div>}
              {location && <div className="rb-location">{location}</div>}
            </div>
            <Button variant="light" size="sm" onClick={() => onDetails(job)}>
              Details
            </Button>
          </div>
        )}

        {/* Can be delivered directly */}
        {applyUrl && (
          <div className="mt-3">
            <Button as="a" href={applyUrl} target="_blank" rel="noreferrer" variant="primary" size="sm">
              Apply
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}