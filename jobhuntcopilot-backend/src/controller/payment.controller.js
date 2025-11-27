const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { adminAuth } = require("../firebase/firebaseAdmin");
const User = require("../models/User");

// Create Stripe Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { uid } = req.user;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "JobHuntCopilot Premium Upgrade" },
            unit_amount: 999, // $9.99
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        uid: uid,
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};
