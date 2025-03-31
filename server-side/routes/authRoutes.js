const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in .env");
  process.exit(1);
}

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// User Signup
router.post("/signup", async (req, res) => {
  console.log("Signup Request Received:", req.body);
  let { fname, lname, phone, email, password } = req.body;

  if (!fname || !lname || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    email = email.toLowerCase();

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already exists" }); // ✅ Improved error message
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user (Fixed column names)
    await db.query(
      "INSERT INTO users (name, lname, phone, email, password) VALUES (?, ?, ?, ?, ?)",
      [fname, lname, phone, email, hashedPassword]
    );

    console.log("User registered:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  console.log("Login Request Received:", req.body);
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    email = email.toLowerCase();

    // Fetch user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    console.log("Login successful, token generated for:", email);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
