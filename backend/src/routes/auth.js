const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");
const { protect } = require("../middleware/auth");
const { wrap } = require("../utils");

const sign = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin });

router.post("/register", wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ error: "Email already registered" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}));

router.post("/login", wrap(async (req, res) => {
  const { email = "", password = "" } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Wrong email or password" });
  }
  res.json({ token: sign(user), user: publicUser(user) });
}));

router.get("/me", protect, (req, res) => res.json(publicUser(req.user)));

module.exports = router;
