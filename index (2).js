const express = require("express");
const cors = require("cors");

require("dotenv").config();


// routes
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bankRoutes = require("./routes/bankRoutes");
const fileRoutes = require("./routes/fileRoutes")

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/file",fileRoutes)

// ✅ MongoDB Connection
const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);