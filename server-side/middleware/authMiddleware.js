const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  // If token is in the Authorization header, extract it
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
