const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require("./config");

const products = [
  // Electronics
  { name: "Wireless Headphones", category: "Electronics", emoji: "🎧", price: 79.99, stock: 25, rating: 4.6, featured: true, description: "Over-ear Bluetooth headphones with noise isolation and 30 hours of battery life." },
  { name: "Smart Watch", category: "Electronics", emoji: "⌚", price: 129.0, stock: 15, rating: 4.4, featured: true, description: "Track steps, heart rate and sleep. Water resistant with a bright AMOLED screen." },
  { name: "Laptop 15\"", category: "Electronics", emoji: "💻", price: 699.0, stock: 8, rating: 4.7, featured: true, description: "15-inch laptop with 16GB RAM, 512GB SSD and a full-day battery." },
  { name: "Mechanical Keyboard", category: "Electronics", emoji: "⌨️", price: 59.5, stock: 30, rating: 4.5, description: "Tactile switches, RGB backlight and a sturdy aluminium frame." },
  { name: "Bluetooth Speaker", category: "Electronics", emoji: "🔊", price: 39.9, stock: 40, rating: 4.3, description: "Portable speaker with deep bass and 12 hours of playtime." },
  // Fashion
  { name: "Classic Sneakers", category: "Fashion", emoji: "👟", price: 64.99, stock: 50, rating: 4.5, featured: true, description: "Comfortable everyday sneakers with a cushioned sole." },
  { name: "Denim Jacket", category: "Fashion", emoji: "🧥", price: 89.0, stock: 20, rating: 4.2, description: "Timeless denim jacket with a relaxed fit." },
  { name: "Leather Backpack", category: "Fashion", emoji: "🎒", price: 74.0, stock: 18, rating: 4.6, description: "Roomy backpack with a padded laptop compartment." },
  { name: "Sunglasses", category: "Fashion", emoji: "🕶️", price: 24.99, stock: 60, rating: 4.1, description: "UV400 protection with a lightweight frame." },
  // Home
  { name: "Coffee Maker", category: "Home", emoji: "☕", price: 49.99, stock: 22, rating: 4.4, featured: true, description: "Programmable drip coffee maker, brews up to 10 cups." },
  { name: "Desk Lamp", category: "Home", emoji: "💡", price: 29.0, stock: 35, rating: 4.3, description: "Adjustable LED lamp with three brightness levels." },
  { name: "Scented Candle Set", category: "Home", emoji: "🕯️", price: 19.5, stock: 70, rating: 4.7, description: "Set of three soy candles in calming scents." },
  { name: "Cozy Blanket", category: "Home", emoji: "🛋️", price: 34.0, stock: 3, rating: 4.8, description: "Soft fleece blanket, perfect for the sofa." },
  // Books
  { name: "Learn Docker in a Month", category: "Books", emoji: "📘", price: 29.99, stock: 45, rating: 4.7, featured: true, description: "A practical beginner guide to containers and Docker Compose." },
  { name: "Clean Code", category: "Books", emoji: "📗", price: 34.5, stock: 28, rating: 4.8, description: "A handbook of agile software craftsmanship." },
  { name: "Notebook Pack (3)", category: "Books", emoji: "📓", price: 12.0, stock: 100, rating: 4.4, description: "Three dotted notebooks with thick paper." },
  // Sports
  { name: "Yoga Mat", category: "Sports", emoji: "🧘", price: 22.0, stock: 55, rating: 4.5, description: "Non-slip 6mm mat with a carry strap." },
  { name: "Football", category: "Sports", emoji: "⚽", price: 18.99, stock: 80, rating: 4.3, description: "Size 5 match ball, durable and water resistant." },
  { name: "Dumbbell Set", category: "Sports", emoji: "🏋️", price: 99.0, stock: 12, rating: 4.6, featured: true, description: "Adjustable dumbbells from 2 to 20 kg." },
  { name: "Water Bottle", category: "Sports", emoji: "🧴", price: 14.5, stock: 90, rating: 4.4, description: "Insulated steel bottle that keeps drinks cold for 24 hours." },
];

module.exports = async function seed() {
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  }
  if (!(await User.findOne({ email: ADMIN_EMAIL.toLowerCase() }))) {
    await User.create({ name: "Admin", email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), isAdmin: true });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }
};
