const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  checkCode,
  getUsers,
  deleteUser,
  getUser,
  regiserAll,
  getGarbageUser
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forgot password (send code to email)
router.post("/forgot-password", forgotPassword);

// Check code
router.post("/check-code", checkCode);

router.get("/", getUsers)

router.post("/delete-user" , deleteUser)

router.post("/registerAll" , regiserAll)

router.get("/garbage" , getGarbageUser)

router.get("/:id",getUser)

module.exports = router;