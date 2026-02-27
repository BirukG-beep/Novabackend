const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Payment = require("../models/Payment");
const mongoose = require("mongoose");

// Helper to generate 4-digit code
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();
const ETH_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume"
];

const { toEthiopian } = require("ethiopian-date");

const getCurrentEthiopianDate = () => {
  const today = new Date();
  const [ethYear, ethMonth] = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  return { ethYear, ethMonth }; // ethMonth is 1–13
};

const generateMonths = () => {
  const { ethMonth } = getCurrentEthiopianDate();

  return ETH_MONTHS.map((monthName, index) => {
    return {
      month: monthName,
      status: index + 1 < ethMonth ? "X" : "-"
    };
  });
};


// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, password, confirmPassword } = req.body;

    // 1️⃣ Password check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate User ID manually
    const userId = new mongoose.Types.ObjectId();

    // 5️⃣ Create User
    const user = await User.create({
      _id: userId,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
    });

    // 6️⃣ Automatically create Payment document
    // year and months are handled by defaults in schema
    console.log("payemnt")
  await Payment.create({
  _id: userId,
  months: generateMonths()
});

    // 7️⃣ Respond success
    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    if (!identifier || !password)
      return res.status(400).json({ message: "Identifier and password required" });

    const user = await User.findOne({ phone: identifier });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status:false, message: "Server Error" });
  }
};

// FORGOT PASSWORD (Send code to email)

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }};
exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate 4-digit code
    const code = generateCode();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // expires in 10 min
    await user.save();

    // SEND CODE VIA EMAIL
    // configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com", // replace with your email
        pass: "your_app_password",    // Gmail App Password recommended
      },
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: user.email,
      subject: "Your Password Reset Code",
      text: `Your password reset code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// CHECK CODE
exports.checkCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      resetCode: code,
    });

    if (!user) return res.status(400).json({ message: "Invalid code" });

    // Delete code after verification
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.status(200).json({ message: "Code verified successfully", valid: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);
    const payment = await Payment.findByIdAndDelete(id);
    console.log(user , payment)

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User and associated payment record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};