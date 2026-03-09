const mongoose = require("mongoose");
const { toEthiopian } = require("ethiopian-date");

// Function to generate Ethiopian year automatically
const getCurrentEthiopianYear = () => {
  const today = new Date();
  const [ethYear] = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  return ethYear.toString();
};

const UserPayment = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    months: {
      type: Array,
      required: true,
      default: [
        { month: "Meskerem", status: "-" },
        { month: "Tikimt", status: "-" },
        { month: "Hidar", status: "-" },
        { month: "Tahsas", status: "-" },
        { month: "Tir", status: "-" },
        { month: "Yekatit", status: "-" },
        { month: "Megabit", status: "-" },
        { month: "Miazia", status: "-" },
        { month: "Ginbot", status: "-" },
        { month: "Sene", status: "-" },
        { month: "Hamle", status: "-" },
        { month: "Nehase", status: "-" },
        { month: "Pagume", status: "-" }  // Added Pagume
      ]
    },
    year: {
      type: String,
      default: getCurrentEthiopianYear
    }
  },
  { timestamps: true }
);

// Ensure unique user-year combination
UserPayment.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payment", UserPayment);