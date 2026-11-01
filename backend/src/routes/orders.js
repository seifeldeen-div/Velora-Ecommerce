const router = require("express").Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const { wrap, calcPrices } = require("../utils");

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

const restock = (order) =>
  Promise.all(order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty } })));

// Create an order. Prices come from the DATABASE, never from the client.
router.post("/", protect, wrap(async (req, res) => {
  const { items, shipping, paymentMethod = "cod" } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  const { fullName, address, city, phone } = shipping || {};
  if (!fullName || !address || !city || !phone) return res.status(400).json({ error: "Complete shipping details are required" });
  if (!["cod", "card"].includes(paymentMethod)) return res.status(400).json({ error: "Invalid payment method" });

  // merge duplicates + validate
  const wanted = new Map();
  for (const it of items) {
    const qty = parseInt(it.qty, 10);
    if (!mongoose.isValidObjectId(it.productId) || !(qty > 0)) return res.status(400).json({ error: "Invalid cart item" });
    wanted.set(String(it.productId), (wanted.get(String(it.productId)) || 0) + qty);
  }
  const ids = [...wanted.keys()];
  const products = await Product.find({ _id: { $in: ids } });
  if (products.length !== ids.length) return res.status(400).json({ error: "Some products no longer exist" });

  // reserve stock atomically, roll back if any item is short
  const reserved = [];
  try {
    for (const p of products) {
      const qty = wanted.get(String(p._id));
      const ok = await Product.findOneAndUpdate({ _id: p._id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (!ok) throw Object.assign(new Error(`Not enough stock for "${p.name}"`), { status: 400 });
      reserved.push({ id: p._id, qty });
    }
  } catch (err) {
    await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } })));
    throw err;
  }

  const orderItems = products.map((p) => ({
    product: p._id, name: p.name, price: p.price, qty: wanted.get(String(p._id)), emoji: p.emoji, image: p.image,
  }));
  const prices = calcPrices(orderItems.reduce((sum, i) => sum + i.price * i.qty, 0));

  // card payment is SIMULATED in this demo (no real payment gateway)
  const paid = paymentMethod === "card";
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shipping: { fullName, address, city, phone },
    paymentMethod,
    ...prices,
    isPaid: paid,
    status: paid ? "paid" : "pending",
  });
  res.status(201).json(order);
}));

router.get("/mine", protect, wrap(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}));

// admin: all orders
router.get("/", protect, adminOnly, wrap(async (req, res) => {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
}));

router.get("/:id", protect, wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Order not found" });
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ error: "Order not found" });
  const ownerId = order.user._id ? order.user._id : order.user;
  if (String(ownerId) !== String(req.user._id) && !req.user.isAdmin) return res.status(403).json({ error: "Not your order" });
  res.json(order);
}));

// customer cancels their own pending order
router.put("/:id/cancel", protect, wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Order not found" });
  const order = await Order.findById(req.params.id);
  if (!order || String(order.user) !== String(req.user._id)) return res.status(404).json({ error: "Order not found" });
  if (order.status !== "pending") return res.status(400).json({ error: "Only pending orders can be cancelled" });
  order.status = "cancelled";
  await order.save();
  await restock(order);
  res.json(order);
}));

// admin updates status
router.put("/:id/status", protect, adminOnly, wrap(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status" });
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Order not found" });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.status === "cancelled") return res.status(400).json({ error: "Cancelled orders cannot be changed" });
  if (status === "cancelled") await restock(order);
  order.status = status;
  if (status === "paid" || status === "delivered") order.isPaid = true;
  await order.save();
  res.json(order);
}));

module.exports = router;
