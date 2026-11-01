import { createContext, useContext, useEffect, useState } from "react";
import { shippingFor } from "../api.js";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items]);

  function add(product, qty = 1) {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === product._id);
      if (found) {
        return prev.map((i) => (i.productId === product._id ? { ...i, stock: product.stock, qty: Math.min(i.qty + qty, product.stock) } : i));
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, emoji: product.emoji, image: product.image, stock: product.stock, qty: Math.min(qty, product.stock) }];
    });
  }

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.productId === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.productId !== id));
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = Math.round(items.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
  const shipping = shippingFor(subtotal);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal, shipping, total: subtotal + shipping }}>
      {children}
    </CartContext.Provider>
  );
}
