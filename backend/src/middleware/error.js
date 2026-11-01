module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(", ") });
  if (err.name === "CastError") return res.status(400).json({ error: "Invalid id" });
  if (err.code === 11000) return res.status(400).json({ error: "Duplicate value" });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Server error" : err.message });
};
