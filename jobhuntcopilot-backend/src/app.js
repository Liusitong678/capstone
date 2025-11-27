const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/error");
const { handleStripeWebhook } = require("./webhooks/stripeWebhook");

const app = express();

// Stripe Webhook
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    req.rawBody = req.body;
    handleStripeWebhook(req, res);
  }
);

// Core middleware
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) =>
  res.json({ ok: true, service: "JobHuntCopilot API" })
);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
