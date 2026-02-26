const express = require("express");
const router = express.Router();

const {
  getPaymentStatus,
  updatePaymentStatus,
  getAllpayment,
  getLastyear
} = require("../controllers/paymentController");

router.get("/:userId", getPaymentStatus);

router.post("/",getAllpayment)
router.put("/updatePaymentStatus", updatePaymentStatus);
router.get("/:id",getLastyear )
module.exports = router;