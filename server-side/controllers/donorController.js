const db = require("../config/db"); // ✅ Ensure the correct path to db
const bcrypt = require("bcrypt");

// ✅ Register a Donor
exports.registerDonor = async (req, res) => {
    const { name, email, password, phone, city, district, availability, gender, blood_type, weight } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !city || !district || !gender || !blood_type || !weight) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number (10-digit Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO donors (name, email, password, phone, city, district, availability, gender, blood_type, weight) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [
            name, email, hashedPassword, phone, city, district, availability || 1, gender, blood_type, weight
        ]);

        res.status(201).json({ message: "Donor registered successfully", donorId: result.insertId });

    } catch (error) {
        console.error("❌ Registration Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get All Donors
exports.getAllDonors = async (req, res) => {
    try {
        const sql = "SELECT id, name, email, phone, city, district, availability, gender, blood_type, weight FROM donors ORDER BY id DESC";
        const [results] = await db.query(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: "No donors found" });
        }

        res.json(results);
    } catch (error) {
        console.error("❌ Get Donors Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Search Donors by Filters
exports.searchDonors = async (req, res) => {
    const { blood_type, city, district, availability } = req.query;
    
    let sql = "SELECT id, name, phone, city, district, availability, gender, blood_type, weight FROM donors WHERE blood_type = ?";
    let params = [blood_type];

    if (city) {
        sql += " AND city = ?";
        params.push(city);
    }
    if (district) {
        sql += " AND district = ?";
        params.push(district);
    }
    if (availability !== undefined) {
        sql += " AND availability = ?";
        params.push(availability);
    }

    try {
        const [results] = await db.query(sql, params);

        if (results.length === 0) {
            return res.status(404).json({ message: "No matching donors found" });
        }

        res.json(results);
    } catch (error) {
        console.error("❌ Search Donors Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Update Donor Availability
exports.updateAvailability = async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;

    if (availability === undefined) {
        return res.status(400).json({ message: "Availability is required" });
    }

    try {
        const sql = "UPDATE donors SET availability = ? WHERE id = ?";
        const [result] = await db.query(sql, [availability, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.json({ message: "Availability updated successfully" });
    } catch (error) {
        console.error("❌ Update Availability Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
