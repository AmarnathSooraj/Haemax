const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");  // Correct import
const router = express.Router();

// Profile route with authentication middleware
// Get User Profile
router.get("/profile", authenticateToken, async (req, res) => {  // Use authenticateToken here
  try {
    console.log("Request received for user ID:", req.user.userId);  // Log user ID
    const [users] = await db.query("SELECT id, name as fname, lname, email, phone, profilePic FROM users WHERE id = ?", [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
