const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  checkCode,
  getUsers,
  deleteUser,
  getUser
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forgot password (send code to email)
router.post("/forgot-password", forgotPassword);

// Check code
router.post("/check-code", checkCode);

router.get("/:id",getUser)

router.get("/", getUsers)

router.post("/delete-user" , deleteUser)

module.exports = router;