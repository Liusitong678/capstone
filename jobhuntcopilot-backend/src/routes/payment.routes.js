const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/auth");
const { createCheckoutSession } = require("../controller/payment.controller");

router.post("/create-checkout-session", verifyFirebaseToken, createCheckoutSession);

module.exports = router;
