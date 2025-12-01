const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

/* ============================================================
   PLATFORM DETECTOR
   ============================================================ */
function detectPlatform(html) {
  const t = html.toLowerCase();

  if (t.includes("myworkdayjobs")) return "workday";
  if (t.includes("greenhouse.io")) return "greenhouse";
  if (t.includes("lever.co")) return "lever";
  if (t.includes("bamboohr.com")) return "bamboohr";
  if (t.includes("successfactors")) return "successfactors";
  if (t.includes("taleo.net")) return "taleo";
  if (t.includes("js-careers-page-job-list-item")) return "trakstar"; // RideCo format

  return "generic";
}

/* ============================================================
   SCRAPERS FOR EACH PLATFORM (ALL IN THIS FILE)
   ============================================================ */

// ---------- TRAKSTAR / RECRUITERBOX ----------
function scrapeTrakstar(html, baseUrl) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const jobs = [];

  $(".js-careers-page-job-list-item").each((i, el) => {
    const title = $(el).find(".js-job-list-opening-name").text().trim();
    const href = $(el).find("a").attr("href");
    const link = new URL(href, base).toString();
    const location = $(el)
      .find(".js-job-list-opening-loc")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    jobs.push({ title, location, link });
  });

  return jobs;
}

// ---------- GREENHOUSE ----------
function scrapeGreenhouse(html, baseUrl) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const jobs = [];

  $(".opening").each((i, el) => {
    const title = $(el).find("a").text().trim();
    const link = new URL($(el).find("a").attr("href"), base).toString();
    const location = $(el).find(".location").text().trim();

    jobs.push({ title, location, link });
  });

  return jobs;
}

// ---------- LEVER ----------
function scrapeLever(html, baseUrl) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const jobs = [];

  $(".posting").each((i, el) => {
    const title = $(el).find(".posting-title > h5").text().trim();
    const location = $(el).find(".sort-by-location").text().trim();
    const link = new URL($(el).find("a").attr("href"), base).toString();

    jobs.push({ title, location, link });
  });

  return jobs;
}

// ---------- WORKDAY ----------
function scrapeWorkday(html, baseUrl) {
  const match = html.match(/"jobPostings":(\[.*?\])/);
  if (!match) return [];

  const json = JSON.parse(`{"jobPostings": ${match[1]}}`);
  const jobs = [];

  json.jobPostings.forEach(job => {
    jobs.push({
      title: job.title,
      location: job.locationsText,
      link: `${baseUrl}/${job.externalPath}`,
    });
  });

  return jobs;
}

// ---------- BAMBOOHR ----------
async function scrapeBambooHR(baseUrl) {
  try {
    const apiUrl = `${baseUrl}/jobs/`;
    const response = await axios.get(apiUrl);

    if (!response.data?.result) return [];

    return response.data.result.map(job => ({
      title: job.jobOpeningName,
      location: job.location,
      link: `${baseUrl}/jobs/view/${job.id}`,
    }));
  } catch {
    return [];
  }
}

// ---------- GENERIC FALLBACK ----------
function scrapeGeneric(html, baseUrl) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const jobs = [];

  $("a").each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");

    if (!href || !text) return;

    const isJob = /(engineer|developer|manager|specialist|designer|analyst|intern)/i.test(text);
    if (!isJob) return;

    jobs.push({
      title: text,
      location: "Unknown",
      link: new URL(href, base).toString(),
    });
  });

  return jobs;
}

/* ============================================================
   MAIN UNIVERSAL SCRAPER FUNCTION
   ============================================================ */
async function scrapeCareerSite(url) {
  const response = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const html = response.data;
  const platform = detectPlatform(html);

  console.log("🔍 Detected Platform:", platform);

  switch (platform) {
    case "trakstar":
      return scrapeTrakstar(html, url);

    case "greenhouse":
      return scrapeGreenhouse(html, url);

    case "lever":
      return scrapeLever(html, url);

    case "workday":
      return scrapeWorkday(html, url);

    case "bamboohr":
      return await scrapeBambooHR(url);

    default:
      return scrapeGeneric(html, url);
  }
}

/* ============================================================
   UNIVERSAL JOB DETAILS SCRAPER
   ============================================================ */
async function scrapeJobDetails(url) {
  const response = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const html = response.data;
  const $ = cheerio.load(html);

  // Remove visual-only / irrelevant elements
  $("script, style, nav, footer, header, svg, img").remove();

  // Extract job title
  const title =
    $("h1").text().trim() ||
    $("h2").text().trim() ||
    $("title").text().trim() ||
    "Unknown Title";

  // Clean full description text
  const description = $("body").text().replace(/\s+/g, " ").trim();

  // Basic skill extraction via regex (universal)
  const skillRegex =
    /\b(Java|Python|React|Node|AWS|Azure|SQL|C\+\+|Docker|Kubernetes|TypeScript|HTML|CSS|MongoDB|Git|Linux|Express)\b/gi;

  const skills = [...new Set(description.match(skillRegex))] || [];

  // Guess experience level
  let level = "Unknown";
  if (/senior|sr\./i.test(description)) level = "Senior";
  else if (/mid|intermediate/i.test(description)) level = "Mid";
  else if (/junior|entry/i.test(description)) level = "Entry";

  // Salary detection
  const salaryRegex =
    /\$[\d,]+(\s*-\s*\$[\d,]+)?|\b\d{2,3}k\b|\bUSD\s*\d{2,3},\d{3}\b/;
  const salary = description.match(salaryRegex)?.[0] || "Not disclosed";

  return {
    title,
    description,
    skills,
    level,
    salary,
    link: url,
  };
}

module.exports = {
  scrapeCareerSite,
  scrapeJobDetails
};
