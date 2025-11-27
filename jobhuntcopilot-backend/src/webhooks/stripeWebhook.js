const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const { adminAuth } = require("../firebase/firebaseAdmin");
const User = require("../models/User");

exports.handleStripeWebhook = async (req, res) => {
  let event;

  try {
    console.log("🔔 Received Stripe webhook");
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe Webhook received:", event.type);

  // Payment completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata.uid;

    try {
      // Update Firebase custom claim
      const prem = await adminAuth.setCustomUserClaims(uid, { role: "premium" });
        console.log("Firebase custom claims updated:", prem);

      // Update MongoDB user document
      await User.findOneAndUpdate(
        { firebaseUid: uid },
        { role: "premium" },
        { new: true }
      );

      console.log("User upgraded to premium:", uid);

    } catch (err) {
      console.error("Failed to upgrade user:", err);
    }
  }

  res.json({ received: true });
};
