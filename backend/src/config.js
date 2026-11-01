module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/shopdb",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@shop.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin12345",
};
