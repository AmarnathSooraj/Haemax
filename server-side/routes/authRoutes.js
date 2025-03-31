const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
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
  let { fname, lname, phone, email, password, profilePic } = req.body;

  // Check if all required fields are present
  if (!fname || !lname || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    email = email.toLowerCase();

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Set default profile picture if not provided
    if (!profilePic) {
      profilePic = "https://example.com/default-profile.png"; // Replace with your default image URL
    }

    // Insert new user into the database
    await db.query(
      "INSERT INTO users (name, lname, phone, email, password, profilePic) VALUES (?, ?, ?, ?, ?, ?)",
      [fname, lname, phone, email, hashedPassword, profilePic]
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

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    email = email.toLowerCase();

    // Fetch user data (including profilePic)
    const [users] = await db.query("SELECT id, email, password, profilePic FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Compare password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",  // Token expiration time
    });

    // Set the JWT token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production (HTTPS)
      sameSite: "Strict",  // Prevent CSRF attacks
    });

    console.log("Login successful, token generated for:", email);
    res.status(200).json({
      message: "Login successful",
      token,
      profilePic: user.profilePic, // Include profile picture in the response
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Get user details based on user ID extracted from the JWT token
    const [users] = await db.query("SELECT id, name as fname, lname, email, phone, profilePic FROM users WHERE id = ?", [req.user.userId]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile details
    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
