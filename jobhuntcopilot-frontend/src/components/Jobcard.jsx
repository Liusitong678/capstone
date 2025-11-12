import { Card, Badge, Button } from "react-bootstrap";

const SOFT_BG = ["#FFE7D3", "#DDF7EC", "#E8F0FF", "#F7E8FF", "#FFF4E8"];

function hashCode(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function Chip({ children }) {
  return <span className="rb-chip">{children}</span>;
}

export default function JobCard({ job, onDetails, onApply }) {
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

  // 外链安全兜底（允许后端返回不带协议的链接）
  const rawHref = applyUrl || url || "";
  const safeHref = rawHref
    ? /^https?:\/\//i.test(rawHref)
      ? rawHref
      : `https://${rawHref}`
    : "";

  // Generate stable color index based on "company+title"
  const colorKey = `${company}::${title}`;
  const colorIdx = hashCode(colorKey) % SOFT_BG.length;
  const innerBg = SOFT_BG[colorIdx];

  return (
    <Card className="rb-card">
      {/* inner */}
      <div className="rb-card-inner" style={{ background: innerBg }}>
        <div className="rb-card-head">
          {date ? (
            <Badge bg="light" text="dark" className="rb-date">
              {date}
            </Badge>
          ) : (
            <span />
          )}
          <div className="d-flex gap-2 align-items-center">
            {source && (
              <Badge bg="light" text="dark" title="Source">
                {source}
              </Badge>
            )}
            <Button
              size="sm"
              variant="light"
              className="rb-icon-btn"
              title="Save"
              aria-label="Save job"
            >
              ♡
            </Button>
          </div>
        </div>

        <div className="rb-company">{company}</div>
        <h3 className="rb-title">{title}</h3>

        {/* mian content */}
        <div className="rb-card-body">
          {/* skills */}
          {(schedule || level || skills.length > 0) && (
            <div className="rb-chips">
              {schedule && <Chip>{schedule}</Chip>}
              {level && <Chip>{level}</Chip>}
              {skills.slice(0, 6).map((s, i) => (
                <Chip key={i}>{s}</Chip>
              ))}
            </div>
          )}

          {/* Salary/Position */}
          {(salary || location) && (
            <div>
              {salary && <div className="rb-salary">{salary}</div>}
              {location && <div className="rb-location">{location}</div>}
            </div>
          )}
        </div>
      </div>

      {/* buttons */}
      <div className="rb-card-footer">
        {safeHref ? (
        <Button   //change. nb
          variant="primary"
          size="sm"
          onClick={() => {
            if (onApply) onApply(job);   // <-- call only if onApply exists
          }}
        >
          Apply
        </Button>


        ) : (
          <span />
        )}
        <Button variant="light" size="sm" onClick={() => onDetails(job)}>
          Details
        </Button>
      </div>
    </Card>
  );
}
