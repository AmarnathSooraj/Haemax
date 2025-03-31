const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from cookies or authorization header
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
    req.user = decoded;  // Attach user data to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
