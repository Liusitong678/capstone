const { scrapeCareerSite, scrapeJobDetails } = require("../services/universalJobScraper");

/* ============================================================
   PARSE CAREER PAGE (LIST JOBS)
   ============================================================ */
exports.parseCareerPage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    const jobs = await scrapeCareerSite(url);
    return res.json({ jobs });

  } catch (err) {
    console.error("Career Page Scrape Error:", err.message);
    res.status(500).json({ message: "Failed to scrape job listings" });
  }
};

/* ============================================================
   GET JOB DETAILS (SCRAPE JOB DESCRIPTION PAGE)
   ============================================================ */
exports.getJobDetails = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    const details = await scrapeJobDetails(url);
    return res.json(details);

  } catch (err) {
    console.error("Job Detail Scrape Error:", err.message);
    res.status(500).json({ message: "Failed to scrape job details" });
  }
};
