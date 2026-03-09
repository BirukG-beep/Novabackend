const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
// routes
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bankRoutes = require("./routes/bankRoutes");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/banks", bankRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);