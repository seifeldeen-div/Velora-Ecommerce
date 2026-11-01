const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const { wrap, escapeRegex } = require("../utils");

const SORTS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
};

// GET /api/products?search=&category=&sort=&minPrice=&maxPrice=&featured=&page=&limit=
router.get("/", wrap(async (req, res) => {
  const { search, category, sort = "newest", minPrice, maxPrice, featured } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }
  if (category) filter.category = category;
  if (minPrice !== undefined && minPrice !== "" && !isNaN(minPrice)) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice !== undefined && maxPrice !== "" && !isNaN(maxPrice)) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (featured === "true") filter.featured = true;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(SORTS[sort] || SORTS.newest)
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ products, page, pages: Math.max(Math.ceil(total / limit), 1), total });
}));

router.get("/categories", wrap(async (req, res) => {
  const cats = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json(cats.map((c) => ({ name: c._id, count: c.count })));
}));

router.get("/:id", wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Product not found" });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
}));

// ---- admin only ----
router.post("/", protect, adminOnly, wrap(async (req, res) => {
  res.status(201).json(await Product.create(req.body));
}));

router.put("/:id", protect, adminOnly, wrap(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
}));

router.delete("/:id", protect, adminOnly, wrap(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

module.exports = router;
