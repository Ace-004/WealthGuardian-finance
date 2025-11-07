const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(payload.sub)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
