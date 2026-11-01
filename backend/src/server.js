const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGO_URI } = require("./config");
const seed = require("./seed");
const errorHandler = require("./middleware/error");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api", (req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

async function connectWithRetry() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    await seed();
  } catch (err) {
    console.log("MongoDB not ready, retrying in 3s...", err.message);
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
