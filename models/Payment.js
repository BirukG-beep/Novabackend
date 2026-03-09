const mongoose = require("mongoose");
const { toEthiopian } = require("ethiopian-date");

const getCurrentEthiopianYear = () => {
  const today = new Date();
  const [ethYear] = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  return ethYear.toString();
};

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: String,
      required: true,
      default: getCurrentEthiopianYear,
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
        // Pagume is handled separately if needed
      ],
    },
  },
  { timestamps: true }
);

// Ensure one payment document per user per year
paymentSchema.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);