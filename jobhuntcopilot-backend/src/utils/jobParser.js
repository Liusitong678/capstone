// utils/jobParser.js

const NORMALIZE_MAP = [
  [/react\.?js/gi, "react"],
  [/node\.?js/gi, "node"],
  [/next\.?js/gi, "next.js"],
  [/restful|rest\s*api(s)?/gi, "rest api"],
  [/graphql/gi, "graphql"],
  [/docker/gi, "docker"],
  [/k8s/gi, "kubernetes"]
];

// Full skill dictionary stays same but improve later
const SKILL_PATTERNS = [
  // Languages
  "python", "java", "c\\+\\+", "c#", "javascript", "typescript", "ruby", "php",
  "swift", "kotlin", "go", "rust", "scala", "r", "matlab", "perl",
  "bash", "powershell", "shell", "html", "css", "sql", "nosql",

  // Frontend
  "react", "angular", "vue", "svelte", "next\\.js", "nuxt", "redux",
  "bootstrap", "tailwind", "sass", "less", "webpack", "vite", "graphql",

  // Backend
  "node", "express", "django", "flask", "fastapi", "spring boot",
  "rails", "laravel", "asp\\.net", "microservices", "rest api",

  // Data / AI
  "pandas", "numpy", "tensorflow", "pytorch", "keras", "spark",
  "hadoop", "airflow", "kafka", "tableau", "power bi",

  // DevOps
  "aws", "azure", "gcp", "docker", "kubernetes",
  "jenkins", "github actions", "gitlab ci", "terraform",

  // Databases
  "mysql", "postgres", "mongodb", "redis", "elasticsearch",

  // Tools
  "git", "jira", "confluence", "agile", "scrum", "kanban"
];

const SKILL_REGEX = new RegExp(`\\b(${SKILL_PATTERNS.join("|")})\\b`, "gi");

// ------------------------------------------------------------------------

function cleanHtml(raw) {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/•|\*|·|►|–/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function normalizeText(text) {
  let normalized = text.toLowerCase();
  for (const [pattern, replacement] of NORMALIZE_MAP) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

// ------------------------------------------------------------------------
// Title extraction (MUCH BETTER)
function extractTitle(text, lines) {
  const titleRegexes = [
    /job title[:\- ]+(.*)/i,
    /title[:\- ]+(.*)/i,
    /position[:\- ]+(.*)/i
  ];

  for (const re of titleRegexes) {
    const match = text.match(re);
    if (match && match[1].length < 80) return match[1].trim();
  }

  // Try finding first job-like line
  for (const line of lines.slice(0, 8)) {
    if (/(engineer|developer|manager|designer|lead|architect)/i.test(line))
      return line.trim();
  }

  // fallback
  return lines[0] || "Unknown Role";
}

// ------------------------------------------------------------------------
// Company extraction
function extractCompany(text) {
  const match = text.match(/company[:\- ]+(.*)/i);
  if (match) return match[1].split("\n")[0].trim();

  // heuristic: "At Stripe we..."
  const match2 = text.match(/at ([A-Z][A-Za-z0-9& ]{2,}) we/i);
  if (match2) return match2[1].trim();

  return "Unknown";
}

// ------------------------------------------------------------------------
function extractLevel(text) {
  if (/principal/i.test(text)) return "Principal";
  if (/staff/i.test(text)) return "Staff";
  if (/senior|sr\./i.test(text)) return "Senior";
  if (/lead/i.test(text)) return "Lead";
  if (/junior|jr\./i.test(text)) return "Junior";
  return "Not specified";
}

// ------------------------------------------------------------------------
function extractSkills(text) {
  const matches = text.match(SKILL_REGEX);
  if (!matches) return [];

  return [...new Set(matches.map(s => s.toLowerCase().trim()))];
}

// ------------------------------------------------------------------------
function extractDescription(text) {
  const sections = [
    "job description",
    "description",
    "about the role",
    "responsibilities",
    "what you will do"
  ];

  for (const sec of sections) {
    const re = new RegExp(`${sec}[:\\- ]+([\\s\\S]*)`, "i");
    const match = text.match(re);
    if (match) return match[1].trim();
  }

  return text;
}

// ------------------------------------------------------------------------

module.exports.parseJobString = function parseJobString(raw) {
  if (!raw || typeof raw !== "string") {
    return {
      title: "Unknown Role",
      skills: [],
      description: "",
      company: "Unknown",
      level: "Not specified"
    };
  }

  const clean = cleanHtml(raw);
  const normalized = normalizeText(clean);

  const lines = clean.split("\n").filter(Boolean);

  const job = {
    title: extractTitle(clean, lines),
    company: extractCompany(clean),
    level: extractLevel(clean),
    skills: extractSkills(normalized),
    description: extractDescription(clean)
  };

  return job;
};
