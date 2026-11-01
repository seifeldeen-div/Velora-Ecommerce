import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../../api.js";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const load = () => api("/orders").then(setOrders).catch(() => setOrders([]));
  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    setError("");
    try { await api(`/orders/${id}/status`, { method: "PUT", body: { status } }); load(); }
    catch (e) { setError(e.message); }
  }

  if (!orders) return <p>Loading...</p>;

  return (
    <>
      <h3>All orders ({orders.length})</h3>
      {error && <p className="error">{error}</p>}
      <table className="table">
        <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-6).toUpperCase()}</Link></td>
              <td>{o.user?.name}<br /><small>{o.user?.email}</small></td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{money(o.totalPrice)}</td>
              <td>{o.paymentMethod === "cod" ? "COD" : "Card"} {o.isPaid ? "✔" : ""}</td>
              <td>
                <select value={o.status} disabled={o.status === "cancelled"} onChange={(e) => changeStatus(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
