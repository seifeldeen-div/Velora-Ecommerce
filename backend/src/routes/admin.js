const router = require("express").Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");
const { wrap, round2 } = require("../utils");

router.get("/stats", protect, adminOnly, wrap(async (req, res) => {
  const [users, products, orders, revenueAgg, lowStock, recentOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
    Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(8).select("name stock emoji"),
    Order.find().populate("user", "name").sort({ createdAt: -1 }).limit(5),
  ]);
  res.json({ users, products, orders, revenue: round2(revenueAgg[0]?.total || 0), lowStock, recentOrders });
}));

module.exports = router;
