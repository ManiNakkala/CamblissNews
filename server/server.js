// ===============================
// Cambliss News Payment + Auth Server
// ===============================

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { requireAuth } = require("@clerk/express"); // ✅ Correct Clerk import

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------------
// Razorpay Configuration
// -------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// -------------------------------
// Health Check Route
// -------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Cambliss News Payment Server Active",
    timestamp: new Date().toISOString(),
    razorpayConfigured: !!(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET
    ),
  });
});

// -------------------------------
// Clerk Protected Route Example
// -------------------------------
app.get("/api/profile", requireAuth(), (req, res) => {
  res.json({
    message: "✅ Authenticated via Clerk!",
    userId: req.auth.userId,
  });
});

// -------------------------------
// Create Razorpay Order (Protected)
// -------------------------------
app.post("/api/order", requireAuth(), async (req, res) => {
  try {
    const { planId, amount, currency } = req.body;
    const userId = req.auth.userId; // ✅ Clerk Auth user ID

    if (!planId || !amount || !currency) {
      return res.status(400).json({
        error: "Missing required fields: planId, amount, currency",
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId,
        userId,
        orderDate: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      error: "Failed to create order",
      message: error.message,
    });
  }
});

// -------------------------------
// Verify Razorpay Payment (Protected)
// -------------------------------
app.post("/api/verify", requireAuth(), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    const userId = req.auth.userId; // ✅ From Clerk

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Missing payment verification parameters",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      console.log("✅ Payment verified:", {
        userId,
        planId,
        paymentId: payment.id,
        amount: payment.amount / 100,
        status: payment.status,
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
        subscriptionId: `sub_${Date.now()}`,
        payment: {
          id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
        },
      });
    } else {
      res.status(400).json({
        error: "Invalid signature",
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      error: "Verification failed",
      message: error.message,
    });
  }
});

// -------------------------------
// Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Cambliss News Payment Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `💳 Razorpay configured: ${
      !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET)
    }`
  );
  console.log(
    `🔐 Clerk integration active: ${!!process.env.CLERK_SECRET_KEY}\n`
  );

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.warn("\n⚠️  WARNING: Razorpay credentials not configured!");
    console.warn("Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET in .env file\n");
  }

  if (!process.env.CLERK_SECRET_KEY) {
    console.warn("⚠️  WARNING: Clerk Secret Key not found in .env file!\n");
  }
});

module.exports = app;
