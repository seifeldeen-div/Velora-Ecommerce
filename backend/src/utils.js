// Lets us use async/await in Express 4 routes without try/catch everywhere
exports.wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const round2 = (n) => Math.round(n * 100) / 100;
exports.round2 = round2;

// Free shipping for orders of $100 or more, otherwise $10 flat
exports.calcPrices = (itemsPrice) => {
  const items = round2(itemsPrice);
  const shippingPrice = items >= 100 ? 0 : 10;
  return { itemsPrice: items, shippingPrice, totalPrice: round2(items + shippingPrice) };
};

exports.escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
