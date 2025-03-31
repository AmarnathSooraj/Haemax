const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Ensure this is correctly imported

// POST route to insert donor details
router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging log

    const { name, phone, email, blood_type, gender, weight, dob, lastDonatedDate, city, district } = req.body;

    // Check for missing required fields
    if (!name || !phone || !email || !blood_type || !gender || !weight || !dob || !city || !district) {
      return res.status(400).json({ success: false, error: "All required fields must be filled" });
    }

    // ✅ Corrected SQL Query with proper column names
    const sql = `INSERT INTO donors (name, phone, email, blood_type, gender, weight, dob, lastDonatedDate, city, district) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await pool.query(sql, [name, phone, email, blood_type, gender, weight, dob, lastDonatedDate || null, city, district]);

    res.json({ success: true, message: "Donor registered successfully!" });
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    let { blood_type, district, city } = req.query;
    
    // Trim and format inputs
    blood_type = blood_type.trim().toUpperCase();
    district = district.trim();
    city = city.trim();
    
    console.log("🔍 Cleaned Search Params:", { blood_type, district, city });
    
    // Validate that all parameters are provided
    if (!blood_type || !district || !city) {
      return res.status(400).json({ error: "All fields (blood_type, district, city) are required" });
    }
    
    // Build SQL query with strict matching
    const query = `
      SELECT id, name, dob, phone, blood_type, city, district 
      FROM donors 
      WHERE blood_type = ? 
      AND LOWER(TRIM(district)) = LOWER(?) 
      AND LOWER(TRIM(city)) = LOWER(?)`;
    
    console.log("📝 SQL Query:", query);
    console.log("🔹 Query Params:", [blood_type, district, city]);
    
    // Execute query
    const [donors] = await pool.query(query, [blood_type, district, city]);
    
    console.log("📌 Query Result:", donors);
    
    if (donors.length === 0) {
      return res.status(404).json({ message: "No donors found" });
    }
    
    res.json(donors);
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
