import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.name || "", address: "", city: "", phone: "" });
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (items.length === 0) {
    return <div className="container pad center"><h1>Nothing to checkout</h1><Link to="/products" className="btn">Go shopping</Link></div>;
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function placeOrder(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api("/orders", {
        method: "POST",
        body: { items: items.map((i) => ({ productId: i.productId, qty: i.qty })), shipping: form, paymentMethod: payment },
      });
      clear();
      navigate(`/orders/${order._id}`, { state: { placed: true } });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="container pad cartgrid">
      <form onSubmit={placeOrder}>
        <h1>Checkout</h1>
        <h3>Shipping details</h3>
        <div className="formgrid">
          <label>Full name<input required value={form.fullName} onChange={set("fullName")} /></label>
          <label>Phone<input required value={form.phone} onChange={set("phone")} /></label>
          <label className="span2">Address<input required value={form.address} onChange={set("address")} /></label>
          <label>City<input required value={form.city} onChange={set("city")} /></label>
        </div>

        <h3>Payment method</h3>
        <label className="radio"><input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} /> Cash on delivery</label>
        <label className="radio"><input type="radio" checked={payment === "card"} onChange={() => setPayment("card")} /> Credit card (simulated, no real payment)</label>

        {error && <p className="error">{error}</p>}
        <button className="btn big" disabled={busy}>{busy ? "Placing order..." : `Place order · ${money(total)}`}</button>
      </form>

      <aside className="summary">
        <h3>Your items</h3>
        {items.map((i) => (
          <div key={i.productId} className="sumrow"><span>{i.qty} × {i.name}</span><span>{money(i.price * i.qty)}</span></div>
        ))}
        <hr />
        <div className="sumrow"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="sumrow"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
        <div className="sumrow total"><span>Total</span><span>{money(total)}</span></div>
      </aside>
    </div>
  );
}
