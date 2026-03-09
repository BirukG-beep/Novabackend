const express = require("express");
const router = express.Router();

const {
  getPaymentStatus,
  updatePaymentStatus,
  getAllpayment
  // getLastyear removed (not exported)
} = require("../controllers/paymentController");

// Get payment status for a specific user (by userId)
router.get("/:userId", getPaymentStatus);

// Get all payments for a given year (use query param ?year=...)
router.get("/", getAllpayment);  // use GET, not POST

// Update payment status
router.put("/update", updatePaymentStatus);  // changed path to avoid conflict

module.exports = router;