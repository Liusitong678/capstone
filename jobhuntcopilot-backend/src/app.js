const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

// Core middleware
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// API routes
app.use("/api", routes);

// Health (simple)
app.get("/", (req, res) => res.json({ ok: true, name: "JobHuntCopilot API" }));

// Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
