const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Enable CORS with proper settings
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allows cookies & auth headers
}));

// ✅ Middleware to parse JSON & URL-encoded data
app.use(express.json()); // ⬅️ Replaces body-parser.json()
app.use(express.urlencoded({ extended: true })); // ⬅️ Replaces body-parser.urlencoded()

// ✅ Import Routes
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Use Routes
app.use("/api/donors", donorRoutes);
app.use("/api/auth", authRoutes);

const receiverRoutes = require("./routes/receiverRoutes");
app.use("/api/receivers", receiverRoutes);

// ✅ Default 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
