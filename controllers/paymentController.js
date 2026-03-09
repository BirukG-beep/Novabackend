const Payment = require("../models/Payment");
exports.getPaymentStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Payment.find({ _id: userId });
    
    if (!result) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getAllpayment = async (req, res) => {
  try {
    const { year } = req.query;
    console.log(year)

    const payments = await Payment.find({
      year: year.toString(),   // 🔥 convert to string
    });

    console.log("Searching year:", year);
    console.log("Type of year:", typeof year);
    console.log("Result:", payments);

    res.status(200).json({ payments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/updatePaymentStatus
exports.updatePaymentStatus = async (req, res) => {
  console.log("Updating payment status with data:", req.body);
  try {
    const { userId, month, status } = req.body;

    // Find user's payment record for the current year
    const payment = await Payment.findById(userId); // same as findOne({_id: userId})
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Find the month object
    const monthObj = payment.months.find((m) => m.month === month);

    if (monthObj) {
      monthObj.status = status;
    } else {
      payment.months.push({ month, status });
    }

    // ⚡ Important: Tell Mongoose that array changed
    payment.markModified("months");

    await payment.save();

    console.log("Month status updated:", monthObj || { month, status });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLastyear = async (req , res) =>{
      const {id} = req.params;
      const year = lastPayment({id});
      res.status(200).json({year})
}