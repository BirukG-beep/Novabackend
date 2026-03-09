const Payment = require("../models/Payment");

// Define ETH_MONTHS (same as in userController)
const ETH_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir",
  "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene",
  "Hamle", "Nehase", "Pagume"
];

// GET payment status by userId
exports.getPaymentStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find by userId, not _id
    const result = await Payment.find({ userId });
    
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE payment status (with year)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { userId, year, month, status } = req.body;

    if (!userId || !year || !month || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let paymentRecord = await Payment.findOne({ userId, year });

    if (!paymentRecord) {
      const defaultMonths = ETH_MONTHS.map(monthName => ({
        month: monthName,
        status: "-"
      }));
      paymentRecord = await Payment.create({ userId, year, months: defaultMonths });
    }

    const monthIndex = paymentRecord.months.findIndex(m => m.month === month);
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    paymentRecord.months[monthIndex].status = status;
    await paymentRecord.save();

    console.log("Payment status updated:", paymentRecord.months[monthIndex]);
    res.status(200).json({
      message: "Payment status updated successfully",
      paymentRecord
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET all payments for a given year
exports.getAllpayment = async (req, res) => {
  try {
    const { year } = req.query;
    console.log(year);

    const payments = await Payment.find({
      year: year.toString(),
    }).populate("userId"); // optional: populate user details

    res.status(200).json({ payments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};