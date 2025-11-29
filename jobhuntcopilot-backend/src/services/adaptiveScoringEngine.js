const natural = require("natural");
const TfIdf = natural.TfIdf;
const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs"); // required by USE


// USE MODEL (Universal Sentence Encoder)
let useModel = null;

async function loadUseModel() {
  if (!useModel) {
    useModel = await use.load();
  }
  return useModel;
}

// --------------------------------------------------
// TEXT NORMALIZATION
// --------------------------------------------------
function stripHtml(text = "") {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function preprocessText(text = "", maxLength = 4000) {
  if (!text) return "";
  const clean = stripHtml(String(text));
  return clean.slice(0, maxLength);
}

function countWords(text = "") {
  const clean = preprocessText(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

// --------------------------------------------------
// COSINE SIMILARITY
// --------------------------------------------------
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom ? dot / denom : 0;
}

// --------------------------------------------------
// TF–IDF SIMILARITY
// --------------------------------------------------
function computeTfidfSimilarity(textA, textB) {
  const a = preprocessText(textA);
  const b = preprocessText(textB);

  if (!a || !b) return 0;

  const tfidf = new TfIdf();
  tfidf.addDocument(a);
  tfidf.addDocument(b);

  const vocab = new Set();
  tfidf.listTerms(0).forEach((t) => vocab.add(t.term));
  tfidf.listTerms(1).forEach((t) => vocab.add(t.term));

  if (vocab.size === 0) return 0;

  const vectorA = [];
  const vectorB = [];

  vocab.forEach((term) => {
    vectorA.push(tfidf.tfidf(term, 0));
    vectorB.push(tfidf.tfidf(term, 1));
  });

  const cos = cosineSimilarity(vectorA, vectorB);
  return cos * 100; // 0–1 → 0–100
}

// --------------------------------------------------
// SEMANTIC SIMILARITY (USE - Universal Sentence Encoder)
// --------------------------------------------------
async function computeSemanticSimilarity(textA, textB) {
  const a = preprocessText(textA, 3000);
  const b = preprocessText(textB, 3000);

  if (!a || !b) return 0;

  const model = await loadUseModel();
  const embeddings = await model.embed([a, b]);
  const arr = embeddings.arraySync(); // [[...], [...]]

  const cos = cosineSimilarity(arr[0], arr[1]);
  return normalizeSemanticScore(cos);
}

// Map USE cosine (≈0.3–0.85) into 0–100
function normalizeSemanticScore(cos) {
  if (cos <= 0) return 0;

  // optimistic curve
  if (cos >= 0.85) return 98;
  if (cos >= 0.80) return 95 + (cos - 0.80) * 50;  // 95–100
  if (cos >= 0.70) return 85 + (cos - 0.70) * 100; // 85–95
  if (cos >= 0.60) return 70 + (cos - 0.60) * 150; // 70–85
  if (cos >= 0.50) return 50 + (cos - 0.50) * 200; // 50–70

  // below 0.5 → just scaled down
  return cos * 100 * 0.8; // up to ~40
}

// --------------------------------------------------
// HARD SKILL MATCHING (FUZZY / BOUNDARY AWARE)
// --------------------------------------------------
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateSkillVariants(skill) {
  const s = skill.toLowerCase();
  const variants = new Set([s]);

  if (s.endsWith(".js")) {
    variants.add(s.replace(".js", ""));
  }
  if (s === "node.js" || s === "node") {
    variants.add("nodejs");
  }
  if (s === "mongodb") {
    variants.add("mongodb atlas");
  }

  return [...variants];
}

function extractSkills(resumeText, jobSkills) {
  const resume = preprocessText(resumeText).toLowerCase();

  if (!resume || !jobSkills || jobSkills.length === 0) {
    return { matched: [], missing: jobSkills || [] };
  }

  const matched = [];
  const missing = [];

  for (const skill of jobSkills) {
    if (!skill) continue;

    const variants = generateSkillVariants(skill);
    let found = false;

    for (const v of variants) {
      const wordBoundaryRe = new RegExp(`\\b${escapeRegExp(v)}\\b`, "i");
      if (wordBoundaryRe.test(resume)) {
        found = true;
        break;
      }

      // fallback for multi-word phrases
      if (v.includes(" ") && resume.includes(v)) {
        found = true;
        break;
      }
    }

    if (found) matched.push(skill);
    else missing.push(skill);
  }

  return { matched, missing };
}

// --------------------------------------------------
// MAIN ADAPTIVE SCORING FUNCTION
// --------------------------------------------------
exports.computeAdaptiveMatchScore = async (resumeText, job) => {
  try {
    const jobDescription = job?.description || "";
    const jobSkills = Array.isArray(job?.skills) ? job.skills : [];

    const jdWords = countWords(jobDescription);

    // 1) HARD SKILLS
    const { matched, missing } = extractSkills(resumeText, jobSkills);
    const hardMatchScore =
      jobSkills.length > 0 ? (matched.length / jobSkills.length) * 100 : 0;

    let tfidfScore = 0;
    let semanticScore = 0;
    let finalScore = 0;
    let mode = "short";

    // ----------------------------
    // ADAPTIVE STRATEGY
    // ----------------------------

    if (jdWords <= 40) {
      // SUPER SHORT JD  =  skills-heavy, optimistic.
      // No TF-IDF or USE needed here (they're noisy on ultra-short texts).
      mode = "short";
      // optimistic mapping: hard 100 to 95
      finalScore = Math.min(95, hardMatchScore * 0.9 + 10);
    } else {
      // For medium / long JDs we include semantic + TF-IDF.
      tfidfScore = computeTfidfSimilarity(resumeText, jobDescription);
      semanticScore = await computeSemanticSimilarity(
        resumeText,
        jobDescription
      );

      if (jdWords <= 150) {
        mode = "medium";
        // Medium length: more balance
        finalScore =
          hardMatchScore * 0.35 +
          semanticScore * 0.55 +
          tfidfScore * 0.10;
      } else {
        mode = "long";
        // Long, detailed JD: semantic
        finalScore =
          hardMatchScore * 0.25 +
          semanticScore * 0.60 +
          tfidfScore * 0.15;
      }
    }

    // Clamp to [0, 100]
    finalScore = Math.max(0, Math.min(100, finalScore));

    // ----------------------------
    // FEEDBACK
    // ----------------------------
    let feedback;
    if (finalScore >= 80) {
      feedback =
        "Strong match. Your resume aligns very well with this job. You are highly recommended to apply.";
    } else if (finalScore >= 60) {
      feedback =
        "Moderate match. You meet many requirements, but you can still better tailor your resume to this job.";
    } else {
      feedback =
        "Low match. Consider adding more relevant skills and examples that align with this job.";
    }

    if (missing.length > 0) {
      feedback += ` Missing skills: ${missing.join(", ")}.`;
    } else if (jobSkills.length > 0) {
      feedback += " No critical required skills appear to be missing.";
    }

    return {
      score: Math.round(finalScore),
      matched,
      missing,
      feedback,
      breakdown: {
        mode,                // "short" | "medium" | "long"
        hardMatchScore: Math.round(hardMatchScore),
        tfidfScore: Math.round(tfidfScore),
        semanticScore: Math.round(semanticScore),
        jdWordCount: jdWords,
      },
    };
  } catch (err) {
    console.error("❌ Adaptive Scoring Error:", err);
    throw err;
  }
};
