const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "bloodbank",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: process.env.DB_DEBUG === "true",
});

// ✅ Test DB connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit on failure
  }
})();

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔻 Closing MySQL pool...");
  await pool.end();
  console.log("✅ MySQL pool closed");
  process.exit(0);
});

module.exports = pool; // ✅ Ensure we export pool
