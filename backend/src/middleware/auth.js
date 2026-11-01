const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");
const { wrap } = require("../utils");

// Requires a valid "Authorization: Bearer <token>" header
exports.protect = wrap(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not logged in" });
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  const user = await User.findById(payload.id).select("-password");
  if (!user) return res.status(401).json({ error: "User no longer exists" });
  req.user = user;
  next();
});

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ error: "Admin access required" });
};
