const axios = require("axios");
const cheerio = require("cheerio");
const { convert } = require("html-to-text");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseCareerPage = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) return res.status(400).json({ message: "URL is required" });

        console.log(`Fetching: ${url}`);

        // Fetch the Raw HTML
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });

        // Clean the HTML to save tokens
        const $ = cheerio.load(response.data);
        $('script').remove();
        $('style').remove();
        $('nav').remove();
        $('footer').remove();
        $('svg').remove();

        // Convert remaining HTML to plain text structure
        const pageText = convert($.html(), {
            wordwrap: false,
            selectors: [
                { selector: 'a', options: { baseUrl: url } }
            ]
        });

        // Truncate if too huge
        const cleanText = pageText.slice(0, 50000);

        // Ask AI to extract the jobs
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      Analyze the following text extracted from a company career page.
      Extract a list of open job positions.
      
      TEXT DATA:
      ${cleanText}

      Return a JSON Object with a key "jobs" containing an array.
      Each job must have:
      - title: string
      - location: string (or "Remote")
      - link: string (Absolute URL. If the text has a relative link, combine it with ${url})
      
      If no jobs are found, return { "jobs": [] }.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text);

        res.json(json);

    } catch (err) {
        console.error("Scraping Error:", err.message);
        res.status(500).json({ message: "Failed to parse page. It might be a complex SPA." });
    }
};

// Scrape a specific job page
const getJobDetails = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ message: "URL is required" });

        console.log(`🤖 AI Scraping details for: ${url}`);

        // Fetch the page
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            timeout: 10000 // 10s timeout
        });

        // Clean HTML
        const $ = cheerio.load(response.data);
        $('script, style, nav, footer, header, svg, img').remove();

        // Convert to plain text to feed to AI
        const pageText = convert($.html(), {
            wordwrap: false,
            selectors: [{ selector: 'a', options: { ignoreHref: true } }]
        });

        // Truncate to avoid token limits
        const safeText = pageText.slice(0, 30000);

        // Configure Gemini with a Schema
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        title: { type: SchemaType.STRING },
                        company: { type: SchemaType.STRING },
                        location: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING, description: "The full, raw job description text." },
                        skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        level: { type: SchemaType.STRING, description: "Entry, Mid, Senior, or Unknown" },
                        salary: { type: SchemaType.STRING, description: "Salary range if found, else 'Not disclosed'" }
                    },
                    required: ["title", "description", "skills"]
                }
            }
        });

        const prompt = `
      You are an expert Job Data Extractor.
      Analyze the text below from a career page and extract the job details.
      
      - Extract the FULL job description. Do not summarize it. 
      - Extract a list of technical skills mentioned.
      - Infer the company name if not explicitly stated in the text.
      
      PAGE TEXT:
      ${safeText}
    `;

        const result = await model.generateContent(prompt);
        const json = JSON.parse(result.response.text());

        // Return the structured data
        res.json(json);

    } catch (err) {
        console.error("❌ AI Detail Scrape Error:", err.message);
        res.status(500).json({
            message: "Failed to extract details via AI",
            error: err.message
        });
    }
};

module.exports = { parseCareerPage, getJobDetails };